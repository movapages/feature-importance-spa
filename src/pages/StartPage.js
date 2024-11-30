import React, { useState } from 'react';
import Papa from 'papaparse';
import { DatasetService } from '../services/DatasetService';

const StartPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
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
            const data = result.data;
            setPreview(data.slice(0, 5)); // Set preview to first 5 rows
            setTotalRecords(data.length); // Set the total number of rows
            DatasetService.setDataset(data); // Save the entire dataset in the service
          },
        });
      };
      reader.readAsText(uploadedFile);
    } else {
      setError('Please upload a valid CSV file.');
      setFile(null);
      setPreview([]);
      setTotalRecords(0);
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
      {file && (
        <p>
          Uploaded File: <strong>{file.name}</strong> ({totalRecords} records)
        </p>
      )}

      {preview.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">CSV Preview:</h3>
          <div className="overflow-x-auto overflow-y-auto border border-gray-300 rounded-lg max-h-[300px]">
            <table className="table-auto w-full border-collapse">
              <thead>
              <tr className="bg-gray-200 sticky top-0">
                {Object.keys(preview[0]).map((key, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-left text-sm font-bold text-gray-700 border border-gray-300 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {preview.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 whitespace-nowrap"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartPage;
