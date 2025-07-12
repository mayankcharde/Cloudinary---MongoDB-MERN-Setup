
// import './App.css'

// function App() {


//   return (
//     <>
     
//     </>
//   )
// }

// export default App

import React from 'react';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="app">
      <header>
        <h1>MERN Cloudinary Uploader</h1>
        <p>Upload images and videos (Max {import.meta.env.VITE_MAX_FILE_SIZE_MB}MB per file)</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  );
}

export default App;