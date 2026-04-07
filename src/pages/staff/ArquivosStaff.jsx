import { useState, useEffect, useRef } from "react";
import StaffLayout from "./components/StaffLayout"; 
import ModalSmall from "./components/ModalSmall";
import toast from "react-hot-toast";

// Services
import { 
  getNodes, 
  downloadFile 
} from "../../services/fileService";

export default function ArquivosStaff() {
  const [currentPath, setCurrentPath] = useState([{ id: null, name: "Home" }]);
  const [arquivos, setArquivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modais e Seleção
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Estados de Operação
  const [isDownloading, setIsDownloading] = useState(false);
  
  const longPressTimer = useRef(null);
  const currentFolder = currentPath[currentPath.length - 1];

  // Ícones por Extensão (Consistente com Gerente)
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <i className="fas fa-file-pdf text-red-500"></i>;
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp': return <i className="fas fa-file-image text-emerald-400"></i>;
      case 'doc': case 'docx': return <i className="fas fa-file-word text-blue-500"></i>;
      case 'xls': case 'xlsx': return <i className="fas fa-file-excel text-green-500"></i>;
      case 'zip': case 'rar': case '7z': return <i className="fas fa-file-archive text-yellow-600"></i>;
      default: return <i className="fas fa-file-alt text-cyan-500"></i>;
    }
  };

  const fetchArquivos = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // O Staff vê apenas o seu departamento em modo leitura
      const data = await getNodes({ 
        parent: currentFolder.id, 
        department: user?.dept_id 
      });
      setArquivos(data);
    } catch (error) {
      toast.error("Erro ao carregar ficheiros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArquivos(); }, [currentFolder.id]);

  const handleOpen = (item) => {
    if (item.type === "folder") setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
    else setPreviewFile(item);
    setContextMenu(null);
  };

  const handleDownloadAction = async (id, name) => {
    setIsDownloading(true);
    try { await downloadFile(id, name); } 
    catch (e) { toast.error("Erro no download"); } 
    finally { setIsDownloading(false); setContextMenu(null); }
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
      <title>Repositório | Mukanda Cloud</title>
      <StaffLayout title="Explorar Arquivos">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6 bg-slate-900/50 p-3 rounded-lg border border-blue-900/30">
          {currentPath.map((p, i) => (
            <span key={i} className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))} 
                className="hover:text-cyan-400 font-medium transition truncate max-w-37.5 cursor-pointer"
              >
                {i === 0 ? <i className="fas fa-home text-xs"></i> : p.name}
              </button>
              {i < currentPath.length - 1 && <i className="fas fa-chevron-right text-[10px] text-slate-700"></i>}
            </span>
          ))}
        </div>

        {/* Toolbar - Apenas Pesquisa para Staff */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-6">
          <div className="flex flex-col">
            <h2 className="text-white font-bold text-lg">Documentos do Setor</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Acesso apenas para consulta e download</p>
          </div>
          <div className="relative w-full sm:w-80">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              type="text" 
              placeholder="Pesquisar no departamento..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-blue-900 rounded-lg text-sm text-white focus:border-cyan-500 outline-none transition-all" 
            />
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 min-h-100">
          {loading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 italic">
                <i className="fas fa-sync animate-spin text-3xl mb-3 text-cyan-500"></i>
                Carregando repositório...
             </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpen(item)}
                onContextMenu={(e) => { 
                  e.preventDefault(); 
                  setSelectedItem(item); 
                  setContextMenu({ x: e.pageX, y: e.pageY }); 
                }}
                onTouchStart={(e) => onTouchStart(e, item)}
                onTouchEnd={onTouchEnd}
                className="group bg-slate-900 border border-blue-900/40 rounded-xl p-4 cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all flex flex-col items-center justify-center aspect-square text-center"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.type === "folder" ? <i className="fas fa-folder text-yellow-500"></i> : getFileIcon(item.name)}
                </div>
                <p className="text-[11px] text-slate-300 truncate w-full font-medium" title={item.name}>
                  {item.name}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-600">
               <i className="fas fa-folder-open text-5xl mb-4 opacity-10"></i>
               <p className="text-slate-400 font-medium text-sm">Nenhum documento encontrado.</p>
            </div>
          )}
        </div>

        {/* Menu de Contexto (Versão Leitura) */}
        {contextMenu && (
          <div className="fixed z-9999 bg-slate-950 border border-blue-900 rounded-xl w-48 shadow-2xl py-1 overflow-hidden" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <div className="px-4 py-2 text-[10px] text-slate-500 border-b border-blue-900/50 truncate font-bold uppercase bg-slate-900">
              {selectedItem?.name}
            </div>
            <button onClick={() => handleOpen(selectedItem)} className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 transition-colors cursor-pointer">
              <i className="fas fa-eye text-xs"></i> Visualizar
            </button>
            <button 
              disabled={isDownloading} 
              onClick={() => handleDownloadAction(selectedItem.id, selectedItem.name)} 
              className="w-full px-4 py-2 text-left text-sm hover:bg-cyan-500 hover:text-slate-900 flex items-center gap-3 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <i className={`fas ${isDownloading ? 'fa-spinner animate-spin' : 'fa-download'} text-xs`}></i> Download
            </button>
          </div>
        )}

        {/* Modal: PREVIEW (Idêntico ao Gerente) */}
        <ModalSmall isOpen={!!previewFile} onClose={() => setPreviewFile(null)} title={previewFile?.name} icon="fas fa-eye">
          <div className="flex flex-col items-center">
            {previewFile?.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img src={previewFile.url} alt="Preview" className="max-w-full max-h-[60vh] rounded-lg object-contain border border-blue-900/30" />
            ) : previewFile?.name.endsWith('.pdf') ? (
              <iframe src={previewFile.url} className="w-full h-[70vh] rounded-lg border border-blue-900/50" title="PDF Preview"></iframe>
            ) : (
              <div className="py-12 text-center">
                <div className="text-6xl mb-4">{getFileIcon(previewFile?.name || "")}</div>
                <button onClick={() => handleDownloadAction(previewFile.id, previewFile.name)} disabled={isDownloading} className="px-6 py-2 cursor-pointer bg-cyan-500 text-black rounded-lg font-bold flex items-center gap-2 mx-auto transition active:scale-95">
                  <i className={`fas ${isDownloading ? 'fa-sync animate-spin' : 'fa-download'}`}></i>
                  {isDownloading ? 'Baixando...' : 'Descarregar Arquivo'}
                </button>
              </div>
            )}
          </div>
        </ModalSmall>

      </StaffLayout>
    </>
  );
}