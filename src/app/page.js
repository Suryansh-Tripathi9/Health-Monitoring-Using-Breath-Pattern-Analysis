'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import HealthCheckPage from '../components/HealthCheckPage';
import AnalysisProgressPage from '../components/AnalysisProgressPage';
import ResultPage from '../components/ResultPage';
import EnoseCheckPage from '../components/EnoseCheckPage';
import EnoseResultPage from '../components/EnoseResultPage';

export default function Home() {
  const [currentModality, setCurrentModality] = useState('audio'); // 'audio' | 'enose'
  const [currentStep, setCurrentStep] = useState('home'); // 'home' | 'audio_check' | 'audio_analyzing' | 'audio_result' | 'enose_check' | 'enose_result'
  
  // Audio state
  const [initialPreset, setInitialPreset] = useState(null);
  const [analysisParams, setAnalysisParams] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // E-Nose state
  const [enoseResult, setEnoseResult] = useState(null);

  const handleSelectModality = (modality) => {
    setCurrentModality(modality);
    if (modality === 'audio') {
      setCurrentStep('audio_check');
    } else {
      setCurrentStep('enose_check');
    }
  };

  const handleStartAudioCheck = () => {
    setCurrentModality('audio');
    setInitialPreset(null);
    setCurrentStep('audio_check');
  };

  const handleStartEnoseCheck = () => {
    setCurrentModality('enose');
    setCurrentStep('enose_check');
  };

  const handleQuickStartPreset = (presetType) => {
    setCurrentModality('audio');
    setInitialPreset(presetType);
    setCurrentStep('audio_check');
  };

  const handleAnalyseAudio = (params) => {
    setAnalysisParams(params);
    setCurrentStep('audio_analyzing');
  };

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setCurrentStep('audio_result');
  };

  const handleAnalyseEnose = (result) => {
    setEnoseResult(result);
    setCurrentStep('enose_result');
  };

  const handleAnalyseAnotherAudio = () => {
    setAnalysisParams(null);
    setAnalysisResult(null);
    setInitialPreset(null);
    setCurrentStep('audio_check');
  };

  const handleAnalyseAnotherEnose = () => {
    setEnoseResult(null);
    setCurrentStep('enose_check');
  };

  const handleBackHome = () => {
    setAnalysisParams(null);
    setAnalysisResult(null);
    setInitialPreset(null);
    setEnoseResult(null);
    setCurrentStep('home');
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header 
        currentModality={currentModality} 
        onSelectModality={handleSelectModality}
        onNavigateHome={handleBackHome} 
      />

      {/* Main Content Container */}
      <main className="main-content">
        {currentStep === 'home' && (
          <HomePage 
            onStartAudioCheck={handleStartAudioCheck} 
            onStartEnoseCheck={handleStartEnoseCheck}
          />
        )}

        {/* Respiratory Audio Pipeline */}
        {currentStep === 'audio_check' && (
          <HealthCheckPage 
            initialPreset={initialPreset}
            onAnalyseAudio={handleAnalyseAudio} 
            onBackToHome={handleBackHome} 
          />
        )}

        {currentStep === 'audio_analyzing' && analysisParams && (
          <AnalysisProgressPage 
            analysisParams={analysisParams} 
            onAnalysisComplete={handleAnalysisComplete} 
          />
        )}

        {currentStep === 'audio_result' && analysisResult && (
          <ResultPage 
            result={analysisResult} 
            onAnalyseAnother={handleAnalyseAnotherAudio} 
            onBackHome={handleBackHome} 
          />
        )}

        {/* E-Nose Gas Sensor Pipeline */}
        {currentStep === 'enose_check' && (
          <EnoseCheckPage
            onAnalyseEnose={handleAnalyseEnose}
            onBackToHome={handleBackHome}
          />
        )}

        {currentStep === 'enose_result' && enoseResult && (
          <EnoseResultPage
            result={enoseResult}
            onAnalyseAnother={handleAnalyseAnotherEnose}
            onBackHome={handleBackHome}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
