import { useState, useRef, useEffect } from "react";
import SuperAdminLayout from "./components/SuperAdminLayout";
import ModalSmall from "./components/ModalSmall";

export default function DepartamentosSuperAdmin() {
  const [departamentos, setDepartamentos] = useState([
    { id: 1, name: "Financeiro", parent: "Home", pessoas: 5 },
    { id: 2, name: "Recursos Humanos", parent: "Home", pessoas: 3 },
    { id: 3, name: "TI", parent: "Home", pessoas: 8 },
    { id: 4, name: "TI Suporte", parent: "TI", pessoas: 4 },
  ]);

  const [currentPath, setCurrentPath] = useState(["Home"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [novaDepartamento, setNovaDepartamento] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [previewDepartamento, setPreviewDepartamento] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  const dragItem = useRef();

  const currentFolder = currentPath[currentPath.length - 1];
  const departamentosFiltrados = departamentos.filter(
    (d) => d.parent === currentFolder
  );

  // =============================
  // Funções principais
  // =============================
  const handleCriarDepartamento = () => {
    if (!novaDepartamento.trim()) return;
    setDepartamentos([
      ...departamentos,
      { id: Date.now(), name: novaDepartamento, parent: currentFolder, pessoas: 0 },
    ]);
    setNovaDepartamento("");
    setIsModalOpen(false);
  };

  const handleOpen = (item) => {
    setCurrentPath([...currentPath, item.name]);
    closeContextMenu();
  };

  const handlePreview = (item) => {
    setPreviewDepartamento(item);
    closeContextMenu();
  };

  const goToPath = (index) => setCurrentPath(currentPath.slice(0, index + 1));

  const handleDragStart = (item) => (dragItem.current = item);
  const handleDropOnFolder = (folder) => {
    setDepartamentos((prev) =>
      prev.map((d) =>
        d.id === dragItem.current.id ? { ...d, parent: folder.name } : d
      )
    );
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setSelectedDepartamento(item);
    const x = Math.min(e.pageX, window.innerWidth - 150);
    const y = Math.min(e.pageY, window.innerHeight - 120);
    setContextMenu({ x, y });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleRename = () => {
    setDepartamentos((prev) =>
      prev.map((d) =>
        d.id === selectedDepartamento.id ? { ...d, name: renameValue } : d
      )
    );
    setRenameModal(false);
  };

  const handleDelete = () => {
    setDepartamentos((prev) =>
      prev.filter((d) => d.id !== selectedDepartamento.id)
    );
    setDeleteModal(false);
  };

  // =============================
  // Mobile: toque longo
  // =============================
  const handleTouchStart = (item) => {
    const timer = setTimeout(() => {
      setSelectedDepartamento(item);
      setContextMenu({ x: window.innerWidth / 2 - 80, y: window.innerHeight / 2 - 60 });
    }, 600); // 600ms
    return timer;
  };

  const handleTouchEnd = (timer) => clearTimeout(timer);

  // Fechar context menu ao clicar fora
  useEffect(() => {
    if (!contextMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".context-menu")) closeContextMenu();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [contextMenu]);

  // =============================
  // Função total de pessoas (departamento + subdepartamentos)
  // =============================
  const totalPessoas = (depName) => {
    const subDeps = departamentos.filter(d => d.parent === depName);
    const subTotal = subDeps.reduce((acc, d) => acc + totalPessoas(d.name), 0);
    const current = departamentos.find(d => d.name === depName)?.pessoas || 0;
    return current + subTotal;
  };

  // =============================
  // Render
  // =============================
  return (
    <>
      <title>Departamentos | Mukanda Cloud</title>
      <SuperAdminLayout title="Departamentos">

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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg font-semibold w-full sm:w-auto flex justify-center items-center cursor-pointer"
          >
            <i className="fas fa-plus mr-2"></i>
            Novo Departamento
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {departamentosFiltrados.map((dep) => (
            <div
              key={dep.id}
              draggable
              onDragStart={() => handleDragStart(dep)}
              onDrop={() => handleDropOnFolder(dep)}
              onDragOver={(e) => e.preventDefault()}
              onDoubleClick={() => handleOpen(dep)}
              onContextMenu={(e) => handleContextMenu(e, dep)}
              onTouchStart={() => (dep.touchTimer = handleTouchStart(dep))}
              onTouchEnd={() => handleTouchEnd(dep.touchTimer)}
              className="bg-slate-900 border border-blue-900 rounded-xl p-4 cursor-pointer hover:border-cyan-500 flex flex-col items-center"
            >
              <div className="flex justify-center mb-2">
                <i className="fas fa-building text-3xl text-cyan-500"></i>
              </div>
              <p className="text-sm text-center text-slate-300 truncate w-full">{dep.name}</p>
              <p className="text-xs text-slate-400">
                Pessoas: {totalPessoas(dep.name)}
              </p>
            </div>
          ))}
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="context-menu fixed z-9999 bg-slate-900 border border-blue-900 rounded-lg w-36 sm:w-40 shadow-lg"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              onClick={() => handleOpen(selectedDepartamento)}
              className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer"
            >
              Abrir
            </button>
            <button
              onClick={() => handlePreview(selectedDepartamento)}
              className="block px-4 py-2 hover:bg-slate-800 w-full text-left cursor-pointer"
            >
              Preview
            </button>
            <button
              onClick={() => {
                setRenameValue(selectedDepartamento.name);
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

        {/* Modais */}
        <ModalSmall
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Criar Departamento"
          icon="fas fa-plus"
        >
          <input
            value={novaDepartamento}
            onChange={(e) => setNovaDepartamento(e.target.value)}
            placeholder="Nome do departamento"
            className="w-full p-3 bg-slate-800 border border-blue-900 text-white rounded-lg mb-4"
          />
          <button
            onClick={handleCriarDepartamento}
            className="w-full py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg cursor-pointer"
          >
            Criar
          </button>
        </ModalSmall>

        <ModalSmall
          isOpen={renameModal}
          onClose={() => setRenameModal(false)}
          title="Renomear Departamento"
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

        <ModalSmall
          isOpen={!!previewDepartamento}
          onClose={() => setPreviewDepartamento(null)}
          title="Detalhes do Departamento"
          icon="fas fa-eye"
        >
          {previewDepartamento && (
            <div className="flex flex-col gap-4">
              <p className="text-slate-300">
                <strong>Nome:</strong> {previewDepartamento.name}
              </p>
              <p className="text-slate-300">
                <strong>Subdepartamentos:</strong>{" "}
                {departamentos.filter(d => d.parent === previewDepartamento.name).length}
              </p>
              <p className="text-slate-300">
                <strong>Total de pessoas:</strong> {totalPessoas(previewDepartamento.name)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpen(previewDepartamento)}
                  className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg"
                >
                  Abrir
                </button>
                <button
                  onClick={() => {
                    setRenameValue(previewDepartamento.name);
                    setRenameModal(true);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg"
                >
                  Renomear
                </button>
                <button
                  onClick={() => setDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Deletar
                </button>
              </div>
            </div>
          )}
        </ModalSmall>

      </SuperAdminLayout>
    </>
  );
}