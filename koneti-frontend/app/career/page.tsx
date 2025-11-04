"use client";

import React from 'react';
import CareerApplication from "@/components/career/CareerApplication";
import { apiRequest } from "@/utils/api";
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function CareerPage() {
  const { t } = useTranslation();
  
  const handleApplicationSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('position', data.position);
      formData.append('coverLetter', data.coverLetter);
      
      if (data.cv) {
        formData.append('cv', data.cv);
      }

      const response = await apiRequest('/career', {
        method: 'POST',
        body: formData,
        useToken: false
      });

      if (response.ok) {
        toast.success(t('career.success.toast'));
      } else {
        throw new Error(t('career.errors.submitErrorGeneral'));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(t('career.errors.submitError'));
    }
  };

  return (
    <CareerApplication onSubmit={handleApplicationSubmit} />
  );
}