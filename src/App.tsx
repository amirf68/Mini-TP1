/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './SocketContext';
import Presentation from './components/Presentation';
import StudentLogin from './components/StudentLogin';
import StudentView from './components/StudentView';

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/teacher" element={<Presentation />} />
          <Route path="/" element={<StudentLogin />} />
          <Route path="/learn" element={<StudentView />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
