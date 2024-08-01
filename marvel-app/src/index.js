import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';

import './style/style.scss';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// import ReactDOM from 'react-dom/client';

// ReactDOM
//     .createRoot(document.getElementById('root'))
//     .render(
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     );