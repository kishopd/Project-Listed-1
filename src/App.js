import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelLink = () => {
  const [data, setData] = useState([]);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Assuming headers are in the first row, so skipping it
      const filteredData = excelData.slice(1).map((row, index) => ({
        serialNumber: index + 1, // Adding 1 to start with serial number 1
        link: row[1], // Second column as link
        prefix: row[2], // Third column as prefix
        selectedTags: [] // Initialize selected tags for each row
      })).filter(row => row.link && row.prefix);

      setData(filteredData);
    };
    reader.readAsBinaryString(file);
  };

  const handleSelectChange = (e, index) => {
    const selectedTag = e.target.value;
    const newData = [...data];
    const currentTags = newData[index].selectedTags;
    if (!currentTags.includes(selectedTag)) {
      newData[index].selectedTags = [...currentTags, selectedTag];
      setData(newData);
    }
  };

  const handleRemoveTag = (rowIndex, tagIndex) => {
    const newData = [...data];
    newData[rowIndex].selectedTags.splice(tagIndex, 1);
    setData(newData);
  };

  const tags = [
    'Technology',
    'Fashion',
    'Food',
    'Travel',
    'Sports',
    'Music',
    'Art',
    'Health',
    'Education',
    'Finance',
  ];

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Link</th>
            <th>Prefix</th>
            <th>Add Tags</th>
            <th>Selected Tags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.serialNumber}</td>
              <td>
                <a
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  {row.link}
                </a>
              </td>
              <td>{row.prefix}</td>
              <td>
                <div className="custom-select-container">
                  <select
                    className="custom-select"
                    value={''}
                    onChange={(e) => handleSelectChange(e, rowIndex)}
                    style={{ width: '200px', padding: '5px' }} // Ensure select tag button size remains consistent
                  >
                    <option value="" disabled>Select a tag</option>
                    {tags.slice(0, 10).map((tag, tagIndex) => (
                      <option key={tagIndex} value={tag}>
                        {`Tag ${tagIndex + 1} (${tag})`}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td>
                {Array.from(new Set(row.selectedTags)).map((tag, tagIndex) => (
                  <span key={tagIndex}>
                    {`Tag ${tags.indexOf(tag) + 1}`}
                    <button onClick={() => handleRemoveTag(rowIndex, tagIndex)}>-</button>
                  </span>
                ))}
                {!row.selectedTags.length && ' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelLink;
