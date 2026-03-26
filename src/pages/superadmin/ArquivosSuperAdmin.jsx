import { useState, useRef, useEffect } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

export default function ArquivosSuperAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaPasta, setNovaPasta] = useState("");
  const [currentPath, setCurrentPath] = useState(["Home"]);
  const [contextMenu, setContextMenu] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const dragItem = useRef();

  const [arquivos, setArquivos] = useState([
    { id: 1, name: "Financeiro", type: "folder", parent: "Home" },
    { id: 2, name: "Relatorio.pdf", type: "pdf", parent: "Home", url: "/docs/teste.pdf" },
    { id: 3, name: "Imagem.png", type: "image", parent: "Home", url: "/img/teste.png" },
  ]);

  const currentFolder = currentPath[currentPath.length - 1];
  const arquivosFiltrados = arquivos.filter((a) => a.parent === currentFolder);

  // =============================
  // Criar pasta
  // =============================
  const handleCriarPasta = () => {
    if (!novaPasta.trim()) return;
    setArquivos([
      ...arquivos,
      { id: Date.now(), name: novaPasta, type: "folder", parent: currentFolder },
    ]);
    setNovaPasta("");
    setIsModalOpen(false);
  };

  // Abrir item
  const handleOpen = (item) => {
    if (item.type === "folder") setCurrentPath([...currentPath, item.name]);
    else setPreviewFile(item);
  };

  // Breadcrumb
  const goToPath = (index) => setCurrentPath(currentPath.slice(0, index + 1));

  // Upload com progress
  const handleUpload = (files) => {
    const file = files[0];
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setArquivos((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: file.name,
            type: file.type.includes("image") ? "image" : "pdf",
            parent: currentFolder,
            url: URL.createObjectURL(file),
          },
        ]);
        setUploadProgress(0);
      }
    }, 200);
  };

  // Drag upload
  const handleDrop = (e) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  // Drag mover arquivos
  const handleDragStart = (item) => (dragItem.current = item);
  const handleDropOnFolder = (folder) => {
    setArquivos((prev) =>
      prev.map((item) => (item.id === dragItem.current.id ? { ...item, parent: folder.name } : item))
    );
  };

  // Context Menu
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    const x = Math.min(e.pageX, window.innerWidth - 150);
    const y = Math.min(e.pageY, window.innerHeight - 120);
    setContextMenu({ x, y });
  };
  const closeContextMenu = () => setContextMenu(null);

  // Renomear
  const handleRename = () => {
    setArquivos((prev) =>
      prev.map((i) => (i.id === selectedItem.id ? { ...i, name: renameValue } : i))
    );
    setRenameModal(false);
  };

  // Deletar
  const handleDelete = () => {
    setArquivos((prev) => prev.filter((i) => i.id !== selectedItem.id));
    setDeleteModal(false);
  };

  // Mobile: abrir menu de contexto via toque longo
  const handleTouchStart = (item) => {
    const timer = setTimeout(() => {
      setSelectedItem(item);
      setContextMenu({ x: window.innerWidth / 2 - 80, y: window.innerHeight / 2 - 60 });
    }, 600); // 600ms toque longo
    return timer;
  };

  const handleTouchEnd = (timer) => {
    clearTimeout(timer);
  };

  // Fechar context menu ao clicar fora (desktop e mobile)
  useEffect(() => {
    if (!contextMenu) return; // só adiciona listener se o menu estiver aberto

    const handleClickOutside = () => {
      closeContextMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <>
      <title>Arquivos | Mukanda Cloud</title>

      <SuperAdminLayout title="Arquivos">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-4">
          {currentPath.map((p, i) => (
            <span key={i} className="flex items-center gap-2">
              <button
                onClick={() => goToPath(i)}
                className="hover:text-cyan-400 cursor-pointer"
              >
                {p}
              </button>
              {i < currentPath.length - 1 && "/"}
            </span>
          ))}
        </div>

        {/* Header com botões empilhados em mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-semibold w-full sm:w-auto flex justify-center items-center cursor-pointer"
          >
            <i className="fas fa-folder-plus mr-2"></i>
            Nova Pasta
          </button>

          <input
            type="file"
            onChange={(e) => handleUpload(e.target.files)}
            className="w-full sm:w-auto text-sm text-slate-400 cursor-pointer"
          />
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-blue-900 rounded-xl p-6 mb-4 text-center text-slate-500 hover:border-cyan-500 cursor-pointer"
        >
          Arraste arquivos aqui
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-slate-800 h-2 rounded-full">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div
          onClick={closeContextMenu}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {arquivosFiltrados.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDoubleClick={() => handleOpen(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              onDrop={() => item.type === "folder" && handleDropOnFolder(item)}
              onDragOver={(e) => e.preventDefault()}
              onTouchStart={() => (item.touchTimer = handleTouchStart(item))}
              onTouchEnd={() => handleTouchEnd(item.touchTimer)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500 flex flex-col items-center"
            >
              <div className="flex justify-center mb-2">
                <i
                  className={`text-3xl ${
                    item.type === "folder"
                      ? "fas fa-folder text-cyan-500"
                      : item.type === "image"
                      ? "fas fa-file-image text-green-400"
                      : "fas fa-file-pdf text-red-400"
                  }`}
                ></i>
              </div>
              <p className="text-sm text-center text-slate-300 truncate w-full">{item.name}</p>
            </div>
          ))}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-9999 bg-slate-900 border border-blue-900 rounded-lg w-36 sm:w-40 shadow-lg"
          >
            <button
              onClick={() => handleOpen(selectedItem)}
              className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer"
            >
              Abrir
            </button>

            <button
              onClick={() => {
                setRenameValue(selectedItem.name);
                setRenameModal(true);
                closeContextMenu();
              }}
              className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer"
            >
              Renomear
            </button>

            <button
              onClick={() => {
                setDeleteModal(true);
                closeContextMenu();
              }}
              className="block px-4 py-2 text-red-400 hover:bg-slate-800 w-full text-left cursor-pointer"
            >
              Deletar
            </button>
          </div>
        )}

        {/* Modal Nova Pasta */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nova Pasta"
          icon="fas fa-folder-plus"
        >
          <input
            value={novaPasta}
            onChange={(e) => setNovaPasta(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
          />
          <button
            onClick={handleCriarPasta}
            className="w-full py-2 bg-cyan-500 text-slate-900 rounded-lg cursor-pointer"
          >
            Criar
          </button>
        </ModalSmall>

        {/* Modal Renomear */}
        <ModalSmall
          isOpen={renameModal}
          onClose={() => setRenameModal(false)}
          title="Renomear"
          icon="fas fa-edit"
        >
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
          />
          <button
            onClick={handleRename}
            className="w-full py-2 bg-cyan-500 text-slate-900 rounded-lg cursor-pointer"
          >
            Salvar
          </button>
        </ModalSmall>

        {/* Modal Deletar */}
        <ModalSmall
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="Confirmar Exclusão"
          icon="fas fa-trash"
        >
          <button
            onClick={handleDelete}
            className="w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer"
          >
            Deletar
          </button>
        </ModalSmall>

        {/* Modal Preview */}
        <ModalSmall
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title="Preview"
          icon="fas fa-eye"
        >
          {previewFile?.type === "image" && (
            <img
              src={previewFile.url}
              className="rounded-lg w-full max-h-[70vh] object-contain"
            />
          )}

          {previewFile?.type === "pdf" && (
            <div className="flex flex-col items-center">
              {/* Detecta mobile */}
              {window.innerWidth < 768 ? (
                <a
                  href={previewFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg cursor-pointer"
                >
                  Abrir PDF
                </a>
              ) : (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[70vh]"
                ></iframe>
              )}
            </div>
          )}
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}