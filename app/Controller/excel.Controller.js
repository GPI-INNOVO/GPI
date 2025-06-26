const XLSX = require('xlsx');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');


const processExcelFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    // Leer el archivo Excel
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    const workbook = XLSX.readFile(filePath);

    // Leer la primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    res.status(200).json({
      message: 'Archivo procesado correctamente',
      data: data,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Error al procesar el archivo' });
  }
};

const excelAsignaciones = (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No se ha subido ningún archivo' });
      }

      const archivo = req.file;
      // // console.log('Uploaded file:', archivo); // Debugging log

      let filePath = path.join(__dirname, '../../asignaciones');
      if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
      }
      const fileName = `${archivo.originalname}`;
      const finalPath = path.join(filePath, fileName);
      
      if (fs.existsSync(finalPath)) {
          return res.status(400).json({ message: 'El archivo ya existe' });
      }
      fs.writeFileSync(finalPath, archivo.buffer);


      // Read Excel file
      let workbook;
      try {
          workbook = XLSX.readFile(finalPath);
      } catch (err) {
          // console.error('Error reading Excel file:', err);
          return res.status(400).json({ message: 'Archivo Excel inválido', error: err.message });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Call Python script
      const pythonScriptPath = path.join(__dirname, '../../../Asistente', 'Funciones.py');
      // console.log('Python script path:', pythonScriptPath); // Debugging log
      exec(`python3 ${pythonScriptPath} asignar_sector "${finalPath}"`, (error, stdout, stderr) => {
          if (error) {
              // // console.error(`Error al ejecutar el script de Python: ${error.message}`);
              return res.status(500).json({ message: 'Error al procesar el archivo con el script de Python', error: error.message });
          }
          // // console.log(`Resultado del script de Python: ${stdout}`);
      });

      // Respond with the extracted data
      res.status(200).json({
          message: 'Archivo procesado correctamente',
          // data: data,
      });
  } catch (error) {
      // console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
  }
};

const excelAte = (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ message: 'No se ha subido ningún archivo' });
      }

      const archivo = req.file;
      // // console.log('Uploaded file:', archivo); // Debugging log

      let filePath = path.join(__dirname, '../../ate');
      if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
      }
      const fileName = `${archivo.originalname}`;
      const finalPath = path.join(filePath, fileName);
      
      if (fs.existsSync(finalPath)) {
          return res.status(400).json({ message: 'El archivo ya existe' });
      }
      fs.writeFileSync(finalPath, archivo.buffer);


      // Read Excel file
      let workbook;
      try {
          workbook = XLSX.readFile(finalPath);
      } catch (err) {
          // console.error('Error reading Excel file:', err);
          return res.status(400).json({ message: 'Archivo Excel inválido', error: err.message });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Call Python script
      const pythonScriptPath = path.join(__dirname, '../../../Asistente', 'Funciones.py');
      // console.log('Python script path:', pythonScriptPath); // Debugging log
      exec(`python3 ${pythonScriptPath} asignar_ate "${finalPath}"`, (error, stdout, stderr) => {
          if (error) {
              // // console.error(`Error al ejecutar el script de Python: ${error.message}`);
              return res.status(500).json({ message: 'Error al procesar el archivo con el script de Python', error: error.message });
          }
          // // console.log(`Resultado del script de Python: ${stdout}`);
      });

      // Respond with the extracted data
      res.status(200).json({
          message: 'Archivo procesado correctamente',
          // data: data,
      });
  } catch (error) {
      // console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
  }
};

const descarga_ATE = (req, res) => {
    try {
      const { fecha } = req.body;
      const pythonScriptPath = path.join(__dirname, '../../../Asistente', 'Funciones.py');
  
      // console.log(`Ejecutando: python3 ${pythonScriptPath} excel_ate --fecha_inicio ${fecha}`);
      
      exec(`python3 ${pythonScriptPath} excel_ate --fecha_inicio ${fecha}`, (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({ message: 'Error al procesar el archivo con el script de Python', error: error.message });
        }
        if (stderr) {
          // console.error(`stderr: ${stderr}`);
          return res.status(500).json({ message: 'Error al procesar el archivo con el script de Python', error: stderr });
        }
  
        let pathexcel = stdout.trim(); // Ruta del archivo generada por el script Python
  
        if (!pathexcel) {
          return res.status(500).json({ message: 'No se generó un archivo válido para descargar' });
        }

        // Enviar el archivo como descarga
        res.download(pathexcel, (err) => {
          if (err) {
            // console.error('Error al enviar el archivo:', err);
            return res.status(500).json({ message: 'Error al descargar el archivo', error: err.message });
          }
        });
      });
  
    } catch (error) {
      // console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Error al descargar el archivo', error: error.message });
    }
  };
  
  const descargar_novedad = (req, res) => {
    try {
      const { fechainicio, fechafin } = req.body;
  
      const pythonScriptPath = path.join(__dirname, '../../../Asistente', 'Funciones.py');
  
      exec(`python3 ${pythonScriptPath} excel_novedad --fecha_inicio ${fechainicio} --fecha_fin ${fechafin}`, (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({ message: 'Error al procesar el archivo con el script de Python', error: error.message });
        }
  
        if (stderr) {
          // console.error(`stderr: ${stderr}`);
          return res.status(500).json({ message: 'Error al ejecutar el script de Python', error: stderr });
        }
  
        let pathexcel = stdout.trim(); // Eliminar espacios en blanco de la salida
  
        if (!pathexcel) {
          return res.status(500).json({ message: 'No se generó un archivo válido para descargar' });
        }
        // Enviar el archivo como descarga
        res.download(pathexcel, (err) => {
          if (err) {
            // console.error('Error al enviar el archivo:', err);
            return res.status(500).json({ message: 'Error al descargar el archivo', error: err.message });
          }
        });
      });
  
    } catch (error) {
      // console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Error al descargar el archivo', error: error.message });
    }
  };
  

module.exports = { processExcelFile ,excelAsignaciones,excelAte,descarga_ATE,descargar_novedad};
