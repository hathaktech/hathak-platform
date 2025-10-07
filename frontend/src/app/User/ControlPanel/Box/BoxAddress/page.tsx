'use client';

import React from 'react';
import UserControlPanel from '@/components/user-control-panel/UserControlPanel';
import AddressOfYourBox from '@/components/user-control-panel/AddressOfYourBox';

const AddressPage: React.FC = () => {
  return (
    <UserControlPanel>
      <AddressOfYourBox />
    </UserControlPanel>
  );
};

export default AddressPage;
