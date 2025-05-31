import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Patients from './Patients';
import Appointments from './Appointments';
// Import từ thư mục gốc vì file Prescriptions nằm ở đó
import Prescriptions from '../Prescriptions';
import Users from './Users';
import Layout from './Layout';

const Admin = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </Layout>
  );
};

export default Admin;
