"use client";

import React from 'react';
import CareerApplication from "@/components/career/CareerApplication";

export default function CareerPage() {
  const handleApplicationSubmit = async (data: any) => {
    console.log('Application submitted:', data);
    // Ovde bi se poslali podaci na backend
    alert('Prijava je uspešno poslata!');
  };

  return (
    <CareerApplication onSubmit={handleApplicationSubmit} />
  );
}