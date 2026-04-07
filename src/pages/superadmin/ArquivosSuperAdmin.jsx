import { useState, useEffect, useRef } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Forms & Validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { folderSchema } from "../../validations/folderSchema";
import { fileSchema } from "../../validations/fileSchema";

// Services
import { 
  getNodes, 
  createFolder, 
  uploadFile, 
  deleteNode, 
  updateNode, 
  downloadFile 
} from "../../services/fileService";
import { getDepartments } from "../../services/departmentService";

export default function ArquivosSuperAdmin() {
  const [currentPath, setCurrentPath] = useState([{ id: null, name: "Home" }]);
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modais e Seleção
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Estados de Operação
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  
  const longPressTimer = useRef(null);
  const currentFolder = currentPath[currentPath.length - 1];

  // Forms
  const { register: registerFolder, handleSubmit: handleSubmitFolder, reset: resetFolder, formState: { errors: errorsFolder, isSubmitting: isCreating } } = useForm({
    resolver: yupResolver(folderSchema),
    defaultValues: { nome: "" },
  });

  const { register: registerRename, handleSubmit: handleSubmitRename, setValue: setRenameValue, formState: { errors: errorsRename, isSubmitting: isRenaming } } = useForm({
    resolver: yupResolver(folderSchema),
  });

  // Lógica de Ícones
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <i className="fas fa-file-pdf text-red-500"></i>;
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp': return <i className="fas fa-file-image text-emerald-400"></i>;
      case 'doc': case 'docx': return <i className="fas fa-file-word text-blue-500"></i>;
      case 'xls': case 'xlsx': return <i className="fas fa-file-excel text-green-500"></i>;
      case 'ppt': case 'pptx': return <i className="fas fa-file-powerpoint text-orange-500"></i>;
      case 'zip': case 'rar': case '7z': return <i className="fas fa-file-archive text-yellow-600"></i>;
      default: return <i className="fas fa-file-alt text-cyan-500"></i>;
    }
  };

  const fetchArquivos = async () => {
    setLoading(true);
    try {
      const data = await getNodes({ parent: currentFolder.id });
      setArquivos(data);
    } catch (error) {
      toast.error("Erro ao carregar ficheiros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArquivos(); }, [currentFolder.id]);

  // Handlers Principais
  const handleOpen = (item) => {
    if (item.type === "folder") setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
    else setPreviewFile(item);
    setContextMenu(null);
  };

  const handleUpload = async (files) => {
    for (const file of Array.from(files)) {
      const uploadId = Date.now() + Math.random();
      try {
        await fileSchema.validate({ file });
        setUploadQueue(prev => [...prev, { id: uploadId, name: file.name }]);
        
        // Chamada para o serviço
        await uploadFile(file, currentFolder.id);
        
        toast.success(`${file.name} enviado!`);
      } catch (err) {
        // Aqui tratamos o Erro 400 que você recebeu
        const errorMessage = err.response?.data?.message || err.message || "Erro desconhecido";
        toast.error(`${file.name}: ${errorMessage}`);
        console.error("Erro no upload:", err.response?.data);
      } finally {
        // ISSO RESOLVE O SEU PEDIDO: O loading para e desaparece mesmo com erro 400
        setUploadQueue(prev => prev.filter(u => u.id !== uploadId));
        fetchArquivos();
      }
    }
  };

  const handleDownloadAction = async (id, name) => {
    setIsDownloading(true);
    try { await downloadFile(id, name); } 
    catch (e) { toast.error("Erro no download"); } 
    finally { setIsDownloading(false); setContextMenu(null); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNode(selectedItem.id);
      toast.success("Eliminado com sucesso!");
      setDeleteModal(false);
      fetchArquivos();
    } catch (error) {
      toast.error("Erro ao eliminar");
    } finally { setIsDeleting(false); }
  };

  // Suporte Mobile (Long Press)
  const onTouchStart = (e, item) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedItem(item);
      const touch = e.touches[0];
      setContextMenu({ x: touch.pageX, y: touch.pageY });
    }, 700);
  };
  const onTouchEnd = () => clearTimeout(longPressTimer.current);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const filteredItems = arquivos.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <title>Arquivos | Mukanda Cloud</title>
      <SuperAdminLayout title="Gestor de Arquivos">

        {/* Breadcrumb - Truncado */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6 bg-slate-900/50 p-3 rounded-lg border border-blue-900/30 overflow-hidden">
          {currentPath.map((p, i) => (
            <span key={i} className="flex items-center gap-2 min-w-0">
              <button 
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))} 
                className="hover:text-cyan-400 font-medium cursor-pointer transition truncate max-w-30"
                title={p.name}
              >
                {i === 0 ? <i className="fas fa-home"></i> : p.name}
              </button>
              {i < currentPath.length - 1 && <i className="fas fa-chevron-right text-[10px] text-slate-700 shrink-0"></i>}
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setIsModalOpen(true)} className="flex-1 cursor-pointer sm:flex-none px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-bold transition active:scale-95">
              <i className="fas fa-folder-plus mr-2"></i> Nova Pasta
            </button>
            <label className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold border border-blue-900 cursor-pointer text-center transition">
              <i className="fas fa-upload mr-2 text-cyan-400"></i> Upload
              <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            </label>
          </div>
          <div className="relative w-full sm:w-64">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-blue-900 rounded-lg text-sm text-white focus:border-cyan-500 outline-none" />
          </div>
        </div>

        {/* Feedback de Upload */}
        {uploadQueue.length > 0 && (
          <div className="fixed bottom-6 right-6 z-999 w-72 space-y-3">
            {uploadQueue.map(u => (
              <div key={u.id} className="bg-slate-900 border border-cyan-500 p-4 rounded-xl shadow-2xl animate-pulse">
                <div className="flex items-center gap-3">
                  <i className="fas fa-sync animate-spin text-cyan-500 shrink-0"></i>
                  <p className="text-xs text-white truncate font-medium flex-1">Enviando: {u.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 min-h-100 p-2">
          {loading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 italic">
                <i className="fas fa-sync animate-spin text-3xl mb-3 text-cyan-500"></i>
                Sincronizando...
             </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpen(item)}
                onContextMenu={(e) => { e.preventDefault(); setSelectedItem(item); setContextMenu({ x: e.pageX, y: e.pageY }); }}
                onTouchStart={(e) => onTouchStart(e, item)}
                onTouchEnd={onTouchEnd}
                className="group bg-slate-900 border border-blue-900/50 rounded-xl p-4 cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center aspect-square text-center overflow-hidden"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.type === "folder" ? <i className="fas fa-folder text-yellow-500"></i> : getFileIcon(item.name)}
                </div>
                <p className="text-[11px] text-slate-300 truncate w-full font-medium px-1" title={item.name}>
                  {item.name}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600">
               <div className="w-20 h-20 bg-slate-900 border border-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-folder-open text-3xl opacity-20"></i>
               </div>
               <p className="text-slate-400 font-medium">Nenhum resultado encontrado</p>
            </div>
          )}
        </div>

        {/* Context Menu - Nomes truncados para não quebrar a largura do menu */}
        {contextMenu && (
          <div className="fixed z-9999 bg-slate-900 border border-blue-900 rounded-xl w-48 shadow-2xl py-1" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <div className="px-4 py-2 text-[10px] text-slate-500 border-b border-blue-900/50 truncate font-bold uppercase">
              {selectedItem?.name}
            </div>
            <button onClick={() => handleOpen(selectedItem)} className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3"><i className="fas fa-eye text-xs"></i> Abrir</button>
            <button disabled={isDownloading} onClick={() => handleDownloadAction(selectedItem.id, selectedItem.name)} className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 disabled:opacity-50">
              <i className={`fas ${isDownloading ? 'fa-spinner animate-spin' : 'fa-download'} text-xs`}></i> Download
            </button>
            <div className="h-px bg-blue-900/50 my-1"></div>
            <button onClick={() => { setRenameValue("nome", selectedItem.name); setRenameModal(true); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3"><i className="fas fa-edit text-xs"></i> Renomear</button>
            <button onClick={() => { setDeleteModal(true); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm hover:bg-red-500 text-red-400 hover:text-white flex items-center gap-3"><i className="fas fa-trash-alt text-xs"></i> Eliminar</button>
          </div>
        )}

        {/* Modal: NOVA PASTA */}
        <ModalSmall isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Pasta" icon="fas fa-folder-plus">
          <form onSubmit={handleSubmitFolder(async (data) => {
            const user = JSON.parse(localStorage.getItem("user"));
            let deptId = user?.dept_id || (await getDepartments())[0]?.id;
            await createFolder({ nome: data.nome.trim(), parent: currentFolder.id, department: deptId });
            toast.success("Pasta criada!"); resetFolder(); setIsModalOpen(false); fetchArquivos();
          })} className="flex flex-col gap-4">
            <input {...registerFolder("nome")} autoFocus placeholder="Nome da pasta" className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg outline-none focus:border-cyan-500" />
            <button type="submit" disabled={isCreating} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-bold rounded-lg transition">
              {isCreating ? <i className="fas fa-sync animate-spin mr-2"></i> : "Criar Pasta"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: RENOMEAR */}
        <ModalSmall isOpen={renameModal} onClose={() => setRenameModal(false)} title="Renomear Item" icon="fas fa-edit">
          <form onSubmit={handleSubmitRename(async (data) => {
            await updateNode(selectedItem.id, { name: data.nome.trim() });
            toast.success("Renomeado!"); setRenameModal(false); fetchArquivos();
          })} className="flex flex-col gap-4">
            <input {...registerRename("nome")} autoFocus className="p-3 bg-slate-800 border border-blue-900 text-white rounded-lg outline-none focus:border-cyan-500" />
            <button type="submit" disabled={isRenaming} className="w-full py-3 bg-cyan-500 text-slate-900 font-bold rounded-lg transition">
              {isRenaming ? <i className="fas fa-sync animate-spin mr-2"></i> : "Salvar Alteração"}
            </button>
          </form>
        </ModalSmall>

        {/* Modal: ELIMINAR */}
        <ModalSmall isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Eliminar Item" icon="fas fa-exclamation-triangle">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-6">Tem certeza que deseja eliminar <span className="text-white font-bold truncate block px-4">"{selectedItem?.name}"</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-bold">Cancelar</button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition">
                {isDeleting ? <i className="fas fa-sync animate-spin"></i> : "Eliminar"}
              </button>
            </div>
          </div>
        </ModalSmall>

        {/* Modal: PREVIEW - Título truncado no header */}
        <ModalSmall isOpen={!!previewFile} onClose={() => setPreviewFile(null)} 
          title={<span className="truncate block max-w-50" title={previewFile?.name}>{previewFile?.name}</span>} 
          icon="fas fa-eye">
          <div className="flex flex-col items-center">
            {previewFile?.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={previewFile.url} alt="Preview" className="max-w-full max-h-[60vh] rounded-lg object-contain border border-blue-900/30" />
            ) : previewFile?.name.endsWith('.pdf') ? (
              <iframe src={previewFile.url} className="w-full h-[60vh] rounded-lg border border-blue-900/50"></iframe>
            ) : (
              <div className="py-12 text-center">
                <div className="text-6xl mb-4">{getFileIcon(previewFile?.name || "")}</div>
                <button onClick={() => handleDownloadAction(previewFile.id, previewFile.name)} disabled={isDownloading} className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-bold flex items-center gap-2">
                  {isDownloading ? <i className="fas fa-sync animate-spin"></i> : <i className="fas fa-download"></i>}
                  {isDownloading ? 'Baixando...' : 'Descarregar'}
                </button>
              </div>
            )}
          </div>
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}