'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import HealthCheckPage from '../components/HealthCheckPage';
import AnalysisProgressPage from '../components/AnalysisProgressPage';
import ResultPage from '../components/ResultPage';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('home'); // 'home' | 'check' | 'analyzing' | 'result'
  const [initialPreset, setInitialPreset] = useState(null);
  const [analysisParams, setAnalysisParams] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleStartCheck = () => {
    setInitialPreset(null);
    setCurrentStep('check');
  };

  const handleQuickStartPreset = (presetType) => {
    setInitialPreset(presetType);
    setCurrentStep('check');
  };

  const handleAnalyseAudio = (params) => {
    setAnalysisParams(params);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setCurrentStep('result');
  };

  const handleAnalyseAnother = () => {
    setAnalysisParams(null);
    setAnalysisResult(null);
    setInitialPreset(null);
    setCurrentStep('check');
  };

  const handleBackHome = () => {
    setAnalysisParams(null);
    setAnalysisResult(null);
    setInitialPreset(null);
    setCurrentStep('home');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        currentStep={currentStep} 
        onNavigateHome={handleBackHome} 
      />

      {/* Main Content Container (Full Width Desktop 1200px Grid) */}
      <main className="main-content">
        {currentStep === 'home' && (
          <HomePage 
            onStartCheck={handleStartCheck} 
            onQuickStartPreset={handleQuickStartPreset}
          />
        )}

        {currentStep === 'check' && (
          <HealthCheckPage 
            initialPreset={initialPreset}
            onAnalyseAudio={handleAnalyseAudio} 
            onBackToHome={handleBackHome} 
          />
        )}

        {currentStep === 'analyzing' && analysisParams && (
          <AnalysisProgressPage 
            analysisParams={analysisParams} 
            onAnalysisComplete={handleAnalysisComplete} 
          />
        )}

        {currentStep === 'result' && analysisResult && (
          <ResultPage 
            result={analysisResult} 
            onAnalyseAnother={handleAnalyseAnother} 
            onBackHome={handleBackHome} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
