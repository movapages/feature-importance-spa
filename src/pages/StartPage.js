import React, { useState } from 'react';
import Papa from 'papaparse';

const StartPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setError('');
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;

        // Parse the CSV file
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setPreview(result.data.slice(0, 5)); // Show first 5 rows
          },
        });
      };
      reader.readAsText(uploadedFile);
    } else {
      setError('Please upload a valid CSV file.');
      setFile(null);
      setPreview([]);
    }
  };

  return (
    <div>
      <h2>Start Page</h2>
      <p>Upload your prepared CSV file to begin:</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {error && <p className="text-red-500">{error}</p>}
      {file && <p>Uploaded File: {file.name}</p>}

      {preview.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">CSV Preview:</h3>
          <table className="table-auto border-collapse border border-gray-300">
            <thead>
            <tr>
              {Object.keys(preview[0]).map((key, index) => (
                <th
                  key={index}
                  className="border px-4 py-2 bg-gray-200 text-left"
                >
                  {key}
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {preview.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="border px-4 py-2 text-sm text-gray-700"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StartPage;
