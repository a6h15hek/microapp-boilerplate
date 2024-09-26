import React from 'react';
import ReactDOM from 'react-dom';
import '@views/index.css';
import HelloWorld from '@views/components/HelloWorld';

function MainApp() {
  return (
    <HelloWorld/>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
