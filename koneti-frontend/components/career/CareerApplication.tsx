import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faUser, faEnvelope, faPhone, faFileAlt, faPaperPlane, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './CareerApplication.scss';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  cv?: File;
}

interface CareerApplicationProps {
  onSubmit: (data: ApplicationData) => void;
}

const CareerApplication: React.FC<CareerApplicationProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  
  const availablePositions: JobPosition[] = [
    { id: '1', title: t('career.positions.waiter'), department: t('career.departments.service'), location: 'Beograd', type: 'Puno radno vreme' },
    { id: '2', title: t('career.positions.barista'), department: t('career.departments.kitchen'), location: 'Beograd', type: 'Puno radno vreme' },
    { id: '3', title: t('career.positions.cook'), department: t('career.departments.kitchen'), location: 'Beograd', type: 'Puno radno vreme' },
    { id: '4', title: t('career.positions.shiftManager'), department: t('career.departments.management'), location: 'Beograd', type: 'Puno radno vreme' },
    { id: '5', title: t('career.positions.cleaner'), department: t('career.departments.maintenance'), location: 'Beograd', type: 'Pola radnog vremena' }
  ];

  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: ''
  });
  
  const [errors, setErrors] = useState<Partial<ApplicationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = t('career.errors.firstName');
    if (!formData.lastName.trim()) newErrors.lastName = t('career.errors.lastName');
    if (!formData.email.trim()) {
      newErrors.email = t('career.errors.email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('career.errors.emailInvalid');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('career.errors.phone');
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t('career.errors.phoneInvalid');
    }
    if (!formData.position.trim()) newErrors.position = t('career.errors.position');
    if (!formData.coverLetter.trim()) newErrors.coverLetter = t('career.errors.coverLetter');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ApplicationData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t('career.upload.fileTooLarge'));
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        alert(t('career.upload.invalidFormat'));
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const applicationData = { ...formData, cv: cvFile || undefined };
      await onSubmit(applicationData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="career-application-page">
      <div className="career-application-container">
        <div className={`page-header ${isLoaded ? 'loaded' : ''}`}>
          <h1>{t('career.title')}</h1>
          <h2>{t('career.subtitle')}</h2>
          <p>{t('career.description')}</p>
        </div>

        <form onSubmit={handleSubmit} className={`application-form ${isLoaded ? 'loaded' : ''}`}>
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {t('career.form.position')}
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={errors.position ? 'error' : ''}
            >
              <option value="">{t('career.form.selectPosition')}</option>
              {availablePositions.map(pos => (
                <option key={pos.id} value={pos.title}>
                  {pos.title} - {pos.department}
                </option>
              ))}
            </select>
            {errors.position && <span className="error-text">{errors.position}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {t('career.form.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
                placeholder={t('career.placeholders.firstName')}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {t('career.form.lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
                placeholder={t('career.placeholders.lastName')}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faEnvelope} />
                {t('career.form.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder={t('career.placeholders.email')}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faPhone} />
                {t('career.form.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder={t('career.placeholders.phone')}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faFileAlt} />
              {t('career.form.coverLetter')}
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              className={errors.coverLetter ? 'error' : ''}
              placeholder={t('career.placeholders.coverLetter')}
              rows={6}
            />
            {errors.coverLetter && <span className="error-text">{errors.coverLetter}</span>}
          </div>

          <div className="form-group cv-upload">
            <label>
              <FontAwesomeIcon icon={faUpload} />
              {t('career.form.cv')}
            </label>
            <div className="upload-area">
              {!cvFile ? (
                <label className="upload-label">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    hidden
                  />
                  <FontAwesomeIcon icon={faUpload} />
                  <span>{t('career.upload.clickToUpload')}</span>
                  <small>{t('career.upload.fileFormats')}</small>
                </label>
              ) : (
                <div className="file-preview">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>{cvFile.name}</span>
                  <button type="button" onClick={() => setCvFile(null)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              <FontAwesomeIcon icon={faPaperPlane} />
              {isSubmitting ? t('career.form.submitting') : t('career.form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerApplication;