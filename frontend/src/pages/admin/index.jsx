import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Patients from './Patients';
import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import Users from './Users';
import Layout from './Layout';
import Medicines from './Medicines';

const Admin = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </Layout>
  );
};

export default Admin;
