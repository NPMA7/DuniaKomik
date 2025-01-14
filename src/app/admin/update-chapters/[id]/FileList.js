import { useEffect, useState } from 'react';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const FileList = ({ refresh }) => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [folderContents, setFolderContents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch('/api/v1/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        console.error('Failed to fetch files:', response.statusText);
      }
    };

    fetchFiles();
  }, [refresh]);

  const handleFolderClick = async (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    const response = await fetch(`/api/v1/files?folderPath=${encodeURIComponent(newPath)}`);
    if (response.ok) {
      const data = await response.json();
      setFolderContents(data);
      setCurrentPath(newPath);
    } else {
      console.error('Failed to fetch folder contents:', response.statusText);
    }
  };

  const handleBackClick = async () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    const newPath = pathParts.join('/');
    setCurrentPath(newPath);
    
    const response = await fetch(`/api/v1/files?folderPath=${encodeURIComponent(newPath)}`);
    if (response.ok) {
      const data = await response.json();
      setFolderContents(data);
    } else {
      console.error('Failed to fetch folder contents:', response.statusText);
    }
  };

  const handleDelete = (fileName) => {
    setFileToDelete(fileName);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    const fullPath = currentPath ? `${currentPath}/${fileToDelete}` : fileToDelete;
    const response = await fetch(`/api/v1/delete-file?filePath=${encodeURIComponent(fullPath)}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setIsModalOpen(false);
      setMessage(`${fileToDelete} berhasil dihapus.`);
      setFolderContents(prev => prev.filter(file => file.name !== fileToDelete));
      setFiles(prev => prev.filter(file => file.name !== fileToDelete));
    } else {
      console.error('Failed to delete file:', response.statusText);
      setMessage('Gagal menghapus file.');
    }
  };

  return (
    <div className="border h-96 overflow-y-auto p-4 rounded-lg shadow-md bg-gray-800">
      <h2 className="font-bold mb-2">Daftar File dan Folder</h2>
      {currentPath && (
        <button onClick={handleBackClick} className="text-blue-500 mb-2">Kembali</button>
      )}
      <ul className="list-disc pl-5">
        {currentPath ? (
          folderContents.map((file, index) => (
            <li key={index} className="flex flex-col justify-between items-start border border-gray-300 p-2 mb-2 rounded">
              <span className="flex justify-between w-full">
                <span>
                  {file.isDirectory ? (
                    <button onClick={() => handleFolderClick(file.name)} className="text-blue-600 underline">
                      {file.name}
                    </button>
                  ) : (
                    file.name
                  )}
                </span>
                <button onClick={() => handleDelete(file.name)} className="text-red-600 ml-2">Hapus</button>
              </span>
              <span className="text-gray-500 text-sm">{`files/${currentPath ? `${currentPath}/${file.name}` : file.name}`}</span>
            </li>
          ))
        ) : (
          files.map((file, index) => (
            <li key={index} className="flex flex-col justify-between items-start border border-gray-300 p-2 mb-2 rounded">
              <span className="flex justify-between w-full">
                <span>
                  {file.isDirectory ? (
                    <button onClick={() => handleFolderClick(file.name)} className="text-blue-600 underline">
                      {file.name}
                    </button>
                  ) : (
                    file.name
                  )}
                </span>
                <button onClick={() => handleDelete(file.name)} className="text-red-600 ml-2">Hapus</button>
              </span>
              <span className="text-gray-500 text-sm">{`files/${file.name}`}</span>
            </li>
          ))
        )}
      </ul>

      {message && <div className="mt-4 text-green-500">{message}</div>}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        fileName={fileToDelete}
      />
    </div>
  );
};

export default FileList;