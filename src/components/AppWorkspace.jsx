import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Play, RefreshCw, Eye, AlertTriangle, FileText, 
  Send, Shield, ArrowRight, HeartPulse, History, Scale, 
  Lock, CheckCircle2, ChevronDown, ChevronUp, Printer, Share2, Sparkles,
  Trash2, RotateCw, ZoomIn, Check, X, CameraOff, Clock, Database,
  BookOpen, Volume2, Video, Pause, Square, RotateCcw, Search
} from 'lucide-react';
import { demoCases, ragQA, spots, voiceTranslations } from '../data/mockData';
import { 
  uploadScreeningImages, 
  runScreeningAnalysis, 
  getScreeningResult, 
  getLocalizedExplanation, 
  getExplanationAudio, 
  getExplanationVideo, 
  askRAGQuestion, 
  askLensAI, 
  generateDoctorReport,
  getNearbyDoctors,
  updateImageMetadata,
  getDatasetStats
} from '../api/client';
import MyHistory from './MyHistory';

const getTranslatedRiskLabel = (risk, lang) => {
  const normalizedRisk = (risk || '').toUpperCase();
  const emojis = {
    HIGH: '🔴',
    MODERATE: '🟡',
    LOW: '🟢',
    UNCERTAIN: '⚪'
  };
  const emoji = emojis[normalizedRisk] || '⚪';

  const translations = {
    English: { HIGH: 'HIGH RISK', MODERATE: 'MODERATE RISK', LOW: 'LOW RISK', UNCERTAIN: 'UNCERTAIN' },
    Telugu: { HIGH: 'అధిక ప్రమాదం', MODERATE: 'మితమైన ప్రమాదం', LOW: 'తక్కువ ప్రమాదం', UNCERTAIN: 'అనిశ్చితం' },
    Hindi: { HIGH: 'उच्च जोखिम', MODERATE: 'मध्यम जोखिम', LOW: 'कम जोखिम', UNCERTAIN: 'अनिश्चित' },
    Kannada: { HIGH: 'ಹೆಚ್ಚಿನ ಅಪಾಯ', MODERATE: 'ಮಧ್ಯಮ ಅಪಾಯ', LOW: 'ಕಡಿಮೆ ಅಪಾಯ', UNCERTAIN: 'ಅನಿಶ್ಚಿತ' },
    Tamil: { HIGH: 'அதிக ஆபத்து', MODERATE: 'மிதமான ஆபத்து', LOW: 'குறைந்த ஆபத்து', UNCERTAIN: 'நிச்சயமற்றது' },
    Malayalam: { HIGH: 'ഉയർന്ന അപായം', MODERATE: 'മിതമായ അപായം', LOW: 'കുറഞ്ഞ അപായം', UNCERTAIN: 'അവ്യക്തം' }
  };

  const textMap = translations[lang] || translations.English;
  const label = textMap[normalizedRisk] || textMap.UNCERTAIN;
  return `${emoji} ${label}`;
};

const getTranslatedDisclaimer = (lang) => {
  const disclaimers = {
    English: "AI screening is not a diagnosis. Low indication does not guarantee that a spot is safe, and high indication does not confirm cancer.",
    Telugu: "ఎఐ పరీక్ష అనేది ఖచ్చితమైన రోగ నిర్ధారణ కాదు. తక్కువ ప్రమాదం అని చూపించినంత మాత్రాన ఆ మచ్చ సురక్షితమైనదని చెప్పలేము, మరియు ఎక్కువ ప్రమాదం అని చూపించినంత మాత్రాన అది క్యాన్సర్ అని నిర్ధారించలేము.",
    Hindi: "एआई जांच कोई निदान नहीं है। कम संकेत यह गारंटी नहीं देता कि धब्बा सुरक्षित है, और उच्च संकेत कैंसर की पुष्टि नहीं करता है।",
    Kannada: "ಎಐ ತಪಾಸಣೆ ಅಧಿಕೃತ ರೋಗನಿರ್ಣಯವಲ್ಲ. ಕಡಿಮೆ ಅಪಾಯದ ಸೂಚನೆ ಚರ್ಮದ ಮಚ್ಚೆ ಸುರಕ್ಷಿತವೆಂದು ಖಾತರಿಪಡಿಸುವುದಿಲ್ಲ ಮತ್ತು ಹೆಚ್ಚಿನ ಅಪಾಯದ ಸೂಚನೆ ಕ್ಯಾನ್ಸರ್ ಅನ್ನು ದೃಢೀಕರಿಸುವುದಿಲ್ಲ.",
    Tamil: "ஏஐ பரிசோதனை என்பது மருத்துவ நோய் கண்டறிதல் அல்ல. குறைந்த ஆபத்து என்பது அந்த புள்ளி பாதுகாப்பானது என்பதற்கு உத்தரவாதமல்ல, அதிக ஆபத்து என்பது புற்றுநோயை உறுதிப்படுத்தாது.",
    Malayalam: "എഐ പരിശോധന ഒരു രോഗനിർണയമല്ല. കുറഞ്ഞ അപകടസാധ്യത എന്നത് ആ മറുക് സുരക്ഷിതമാണെന്ന് ഉറപ്പ് നൽകുന്നില്ല, ഉയർന്ന അപകടസാധ്യത എന്നത് ക്യാൻസർ സ്ഥിരീകരിക്കുന്നില്ല."
  };
  return disclaimers[lang] || disclaimers.English;
};

const getTranslatedNextSteps = (lang) => {
  const steps = {
    English: [
      "Protect the spot from excess UV rays and solar exposure.",
      "Schedule a clinical dermatologist examination for confirmation.",
      "Download the Doctor Summary PDF to discuss at your visit."
    ],
    Telugu: [
      "మచ్చను అధిక యూవీ కిరణాలు మరియు సూర్యరశ్మి నుండి రక్షించండి.",
      "ధృవీకరణ కోసం క్లినికల్ డెర్మటాలజిస్ట్ పరీక్షను షెడ్యూల్ చేయండి.",
      "మీ సందర్శనలో చర్చించడానికి డాక్టర్ సారాంశం PDFని డౌన్‌లోడ్ చేయండి."
    ],
    Hindi: [
      "अत्यधिक यूवी किरणों और धूप के संपर्क से त्वचा को बचाएं।",
      "पुष्टि के लिए त्वचा रोग विशेषज्ञ से क्लिनिकल जांच का समय तय करें।",
      "अपनी यात्रा में चर्चा करने के लिए डॉक्टर सारांश पीडीएफ डाउनलोड करें।"
    ],
    Kannada: [
      "ಹೆಚ್ಚಿನ ಯುವಿ ಕಿರಣಗಳು ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ಮಚ್ಚೆಯನ್ನು ರಕ್ಷಿಸಿ.",
      "ದೃಢೀಕರಣಕ್ಕಾಗಿ ಚರ್ಮರೋಗ ವೈದ್ಯರ ಭೇಟಿಯ ಸಮಯವನ್ನು ನಿಗದಿಪಡಿಸಿ.",
      "ನಿಮ್ಮ ಭೇಟಿಯ ಸಮಯದಲ್ಲಿ ಚರ್ಚಿಸಲು ವೈದ್ಯರ ಸಾರಾಂಶ PDF ಅನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
    ],
    Tamil: [
      "சூரிய ஒளி மற்றும் அதிகப்படியான புற ஊதா கதிர்களிடமிருந்து அந்த புள்ளியைப் பாதுகாக்கவும்.",
      "உறுதிப்படுத்தலுக்கு தோல் மருத்துவரை அணுகி பரிசோதனைக்கான நேரವನ್ನು முன்பதிவு செய்யவும்.",
      "உங்கள் சந்திப்பின் போது விவாதிக்க மருத்துவர் சுருக்கம் PDF ஐ பதிவிறக்கவும்."
    ],
    Malayalam: [
      "അമിതമായ യുവി രശ്മികളിൽ നിന്നും സൂര്യപ്രകാശത്തിൽ നിന്നും ആ മറുകിനെ സംരക്ഷിക്കുക.",
      "സ്ഥിരീകരണത്തിനായി ഒരു ഡെർമറ്റോളജിസ്റ്റിന്റെ പരിശോധന മുൻകൂട്ടി നിശ്ചയിക്കുക.",
      "നിങ്ങളുടെ സന്ദർശന വേളയിൽ ചർച്ച ചെയ്യുന്നതിനായി ഡോക്ടർ സമ്മറി പിഡിഎഫ് ഡൗൺലോഡ് ചെയ്യുക."
    ]
  };
  return steps[lang] || steps.English;
};

const getTranslatedScene7 = (lang) => {
  const text = {
    English: { title: "Video Explanation Complete", desc: "You can now print a copy of your doctor summary or share it directly." },
    Telugu: { title: "వీడియో వివరణ పూర్తయింది", desc: "మీరు ఇప్పుడు మీ డాక్టర్ సారాంశం కాపీని ప్రింట్ చేయవచ్చు లేదా నేరుగా భాగస్వామ్యం చేయవచ్చు." },
    Hindi: { title: "वीडियो स्पष्टीकरण पूरा हुआ", desc: "अब आप अपने doctor सारांश की एक प्रति प्रिंट कर सकते हैं या इसे सीधे साझा कर सकते हैं।" },
    Kannada: { title: "ವಿಡಿಯೋ ವಿವರಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ", desc: "ನೀವು ಈಗ ನಿಮ್ಮ ವೈದ್ಯರ ಸಾರಾಂಶದ ಪ್ರತಿಯನ್ನು ಮುದ್ರಿಸಬಹುದು ಅಥವಾ ನೇರವಾಗಿ ಹಂಚಿಕೊಳ್ಳಬಹುದು." },
    Tamil: { title: "வீдео விளக்கம் முடிந்தது", desc: "இப்போது உங்கள் மருத்துவர் சுருக்கத்தின் நகலை அச்சிடலாம் அல்லது நேரடியாகப் பகிரலாம்." },
    Malayalam: { title: "വീഡിയോ വിശദീകരണം പൂർത്തിയായി", desc: "നിങ്ങൾക്ക് ഇപ്പോൾ നിങ്ങളുടെ ഡോക്ടർ സമ്മറിയുടെ ഒരു പകർപ്പ് പ്രിന്റ് ചെയ്യാം അല്ലെങ്കിൽ നേരിട്ട് പങ്കിടാം." }
  };
  return text[lang] || text.English;
};

export default function AppWorkspace({ 
  activeTab, 
  setTab, 
  selectedCaseId, 
  setSelectedCaseId,
  defaultApiMode = true
}) {
  // Get active case data
  const currentCase = demoCases.find(c => c.id === selectedCaseId) || demoCases[1];

  // Hidden File Input Ref
  const fileInputRef = useRef(null);

  // Global Workspace States
  const [uploadedImages, setUploadedImages] = useState([]);
  const [screeningState, setScreeningState] = useState('idle'); // idle -> checking-set -> checked -> scanning -> complete
  const [activeXaiArea, setActiveXaiArea] = useState('Border');
  const [sliderVal, setSliderVal] = useState(50);
  const [selectedMapSpot, setSelectedMapSpot] = useState(null);

  // API Mode & Session states
  const [isApiMode, setIsApiMode] = useState(defaultApiMode);
  const [sessionId, setSessionId] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [audioGenerating, setAudioGenerating] = useState(false);
  const [shareWithDoctorOpen, setShareWithDoctorOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [videoPreparing, setVideoPreparing] = useState(false);
  const [videoVoiceUnavailable, setVideoVoiceUnavailable] = useState(false);
  const audioRef = useRef(null);

  // Validation Error / Duplicate Alert States
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [duplicateFilesPending, setDuplicateFilesPending] = useState([]);
  const [replacingImageId, setReplacingImageId] = useState(null);

  // Zoom / Rotate image viewer state
  const [zoomScale, setZoomScale] = useState(1);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [activeViewerImg, setActiveViewerImg] = useState('');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareLeft, setCompareLeft] = useState('');
  const [compareRight, setCompareRight] = useState('');

  // Camera Simulator Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraSpotIndex, setCameraSpotIndex] = useState(0);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [cameraInitError, setCameraInitError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);

  const videoRefCallback = (node) => {
    if (node) {
      videoRef.current = node;
      if (cameraStreamRef.current && node.srcObject !== cameraStreamRef.current) {
        node.srcObject = cameraStreamRef.current;
      }
    }
  };

  // Scanning animation states
  const [pipelineStep, setPipelineStep] = useState(0);
  const [scanProgressPct, setScanProgressPct] = useState(0);

  // Assistant Chat States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi. I can explain your screening summary and provide general skin-health information.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ragPipelineStep, setRagPipelineStep] = useState(0);
  const [activeSources, setActiveSources] = useState([]);

  // Dataset Stats state
  const [datasetStats, setDatasetStats] = useState({ disease_overview: {}, image_views: {} });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (activeTab === 'dataset') {
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const data = await getDatasetStats();
          setDatasetStats(data || { disease_overview: {}, image_views: {} });
        } catch (err) {
          console.error("Failed to fetch dataset stats:", err);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  // Accessibility & Voice states
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [voiceLang, setVoiceLang] = useState('English');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [patientName, setPatientName] = useState('Arjun');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Video Simulator states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCurrentScene, setVideoCurrentScene] = useState(1);
  const [videoMuted, setVideoMuted] = useState(false);

  // Speech Recognition state
  const [isListeningMic, setIsListeningMic] = useState(false);

  // Web Speech Utterance Ref
  const utteranceRef = useRef(null);

  // Doctor Locator States
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorError, setDoctorError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [locationMethod, setLocationMethod] = useState(null); // 'ask' | 'geo' | 'manual'
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [filterSpec, setFilterSpec] = useState('');
  const [filterDistance, setFilterDistance] = useState(25);
  const [filterRating, setFilterRating] = useState(0);
  const [sortMethod, setSortMethod] = useState('distance');

  const mapRef = useRef(null);
  const markersRef = useRef({});

  const getDoctorDisclaimer = () => {
    let resultType = 'moderate';
    if (isApiMode && apiResult) {
      const cls = (apiResult.classification || '').toLowerCase();
      if (cls.includes('low') || cls.includes('benign')) resultType = 'low';
      else if (cls.includes('high') || cls.includes('malignant') || cls.includes('melanoma') || cls.includes('carcinoma')) resultType = 'high';
      else if (cls.includes('uncertain') || cls.includes('unknown')) resultType = 'uncertain';
    } else {
      if (selectedCaseId === 'case-01') resultType = 'low';
      else if (selectedCaseId === 'case-03') resultType = 'uncertain';
      else if (selectedCaseId === 'case-04') resultType = 'high';
    }

    switch (resultType) {
      case 'low':
        return "Professional consultation is available if you have concerns about the result.";
      case 'high':
        return "Consider arranging a professional evaluation.";
      case 'uncertain':
        return "The available images did not provide enough consistent information. A professional evaluation may help.";
      case 'moderate':
      default:
        return "Consider discussing this screening result with a qualified healthcare professional.";
    }
  };

  const getDoctorCountSummary = () => {
    const count = doctorList.length;
    const specText = filterSpec ? (filterSpec === 'Dermatologist' ? 'dermatologists' : filterSpec.toLowerCase() + 's') : 'professional doctors';
    return `${count} ${specText} found near you`;
  };

  const loadDoctors = async (lat, lon, addr = null) => {
    setLoadingDoctors(true);
    setDoctorError('');
    try {
      const res = await getNearbyDoctors({
        latitude: lat,
        longitude: lon,
        radius: filterDistance,
        specialization: filterSpec || undefined,
        sort: sortMethod,
        rating: filterRating || undefined,
        address: addr || undefined
      });
      setDoctorList(res.doctors || []);
      if (res.doctors && res.doctors.length > 0 && addr) {
        setUserCoords({
          lat: res.doctors[0].latitude - 0.01,
          lon: res.doctors[0].longitude - 0.01
        });
      }
      setLocationMethod(addr ? 'manual_complete' : 'geo');
    } catch (err) {
      setDoctorError("We couldn't find nearby doctors right now. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setLocationMethod('manual');
      return;
    }
    setLoadingDoctors(true);
    setDoctorError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserCoords({ lat, lon });
        setLocationMethod('geo');
        loadDoctors(lat, lon);
      },
      (error) => {
        setLoadingDoctors(false);
        setLocationMethod('manual');
      }
    );
  };

  const handleManualLocationSubmit = (e) => {
    if (e) e.preventDefault();
    if (!manualLocationInput.trim()) return;
    setLoadingDoctors(true);
    setDoctorError('');
    loadDoctors(null, null, manualLocationInput);
  };

  const handleSelectDoctorCard = (doc) => {
    setSelectedDoctorId(doc.id);
    if (mapRef.current && window.L && doc.latitude && doc.longitude) {
      mapRef.current.setView([doc.latitude, doc.longitude], 15);
      const L = window.L;
      Object.keys(markersRef.current).forEach(id => {
        const marker = markersRef.current[id];
        const isSelected = id === doc.id;
        const icon = L.divIcon({
          html: isSelected ? '🔵' : '🔴',
          className: 'doctor-map-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        });
        marker.setIcon(icon);
        if (isSelected) {
          marker.openPopup();
        }
      });
    }
  };

  const handleCenterOnUser = () => {
    if (mapRef.current && userCoords) {
      mapRef.current.setView([userCoords.lat, userCoords.lon], 13);
    }
  };

  const initMap = () => {
    if (!window.L || !userCoords) return;
    const container = document.getElementById('doctor-leaflet-map');
    if (!container) return;
    
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    const L = window.L;
    const map = L.map(container, { zoomControl: true }).setView([userCoords.lat, userCoords.lon], 13);
    mapRef.current = map;
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    const userIcon = L.divIcon({
      html: '📍',
      className: 'user-map-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
    L.marker([userCoords.lat, userCoords.lon], { icon: userIcon })
      .addTo(map)
      .bindPopup('📍 Your Location')
      .openPopup();
      
    markersRef.current = {};
    const bounds = L.latLngBounds([userCoords.lat, userCoords.lon]);
    let hasDoctors = false;

    doctorList.forEach(doc => {
      if (!doc.latitude || !doc.longitude) return;
      bounds.extend([doc.latitude, doc.longitude]);
      hasDoctors = true;

      const docIcon = L.divIcon({
        html: doc.id === selectedDoctorId ? '🔵' : '🔴',
        className: 'doctor-map-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });

      const ratingHtml = doc.rating ? `<span style="color:#e67e22;font-weight:bold;">⭐ ${doc.rating}</span>` : '';
      const popupHtml = `
        <div style="font-family:inherit; min-width:180px;">
          <strong style="font-size:0.9rem; color:#0F4C5C; display:block; margin-bottom:2px;">${doc.name}</strong>
          <span style="font-size:0.75rem; color:#666; display:block; margin-bottom:4px;">${doc.specialization}</span>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:0.75rem; margin-bottom:6px;">
            ${ratingHtml}
            <strong>${doc.distance_km} km</strong>
          </div>
          <button id="pop-btn-${doc.id}" style="width:100%; border:none; background:#0F4C5C; color:#fff; border-radius:4px; padding:4px 8px; font-size:0.7rem; cursor:pointer; font-weight:bold;">View Details</button>
        </div>
      `;

      const marker = L.marker([doc.latitude, doc.longitude], { icon: docIcon })
        .addTo(map)
        .bindPopup(popupHtml);
        
      marker.on('click', () => {
        setSelectedDoctorId(doc.id);
        const card = document.getElementById(`doc-card-${doc.id}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pop-btn-${doc.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.preventDefault();
            setSelectedDoctor(doc);
          };
        }
      });

      markersRef.current[doc.id] = marker;
    });

    if (hasDoctors) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  };

  useEffect(() => {
    if (!showDoctorModal || !userCoords) return;
    
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showDoctorModal, userCoords, doctorList]);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [mapFullscreen]);

  // Stop speaking
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);
  };

  const handleContinueToWhatsApp = () => {
    setShareWithDoctorOpen(false);
    
    const dateStr = new Date().toLocaleDateString();
    const riskVal = isApiMode && apiResult 
      ? apiResult.overallResult 
      : (selectedCaseId === 'case-01' ? 'LOW' : selectedCaseId === 'case-02' ? 'MODERATE' : selectedCaseId === 'case-03' ? 'UNCERTAIN' : 'HIGH');
    
    const riskLabel = getTranslatedRiskLabel(riskVal, voiceLang);
    const summary = isApiMode && apiResult 
      ? apiResult.explanation 
      : (selectedCaseId === 'case-01' 
        ? "A stable and uniform pigment pattern with smooth, regular edges, representing benign features."
        : "Some localized color differences and uneven borders that influence the screening recommendation.");
    
    const disclaimers = {
      English: "This is an AI-assisted screening indication and is NOT a confirmed medical diagnosis.",
      Telugu: "ఇది ఎఐ-సహాయక స్క్రీనింగ్ సూచన మరియు ఇది ధృవీకరించబడిన వైద్య నిర్ధారణ కాదు.",
      Hindi: "यह एक एआई-सहायता प्राप्त स्क्रीनिंग संकेत है और यह एक पुष्ट चिकित्सा निदान नहीं है।",
      Kannada: "ಇದು ಎಐ-ಸಹಾಯಿತ ತಪಾಸಣಾ ಸೂಚನೆಯಾಗಿದೆ ಮತ್ತು ಇದು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯದಲ್ಲ.",
      Tamil: "இது ஏஐ-உதவி பெறும் ஸ்கிரீனிங் அறிகுறியாகும், இது உறுதிப்படுத்தப்பட்ட மருத்துவ நோய் கண்டறிதல் அல்ல.",
      Malayalam: "ഇതൊരു എഐ-സഹായത്തോടെയുള്ള സ്ക്രീനിംഗ് സൂചനയാണ്, സ്ഥിരീകരിച്ച മെഡിക്കൽ രോഗനിർണയമല്ല."
    };
    const disclaimerText = disclaimers[voiceLang] || disclaimers.English;

    const messageTemplate = 
`Hello Doctor,

I would like to share my DermaLens AI screening result for your professional evaluation.

Screening Date:
${dateStr}

Risk Level:
${riskLabel}

AI Screening Summary:
${summary}

Important:
${disclaimerText}

Please review the result and provide professional medical advice.

Thank you.`;

    const encodedMessage = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWatchVideo = () => {
    setVideoCurrentScene(1);
    setVideoPreparing(true);
    setShowVideoModal(true);
    setTimeout(() => {
      setVideoPreparing(false);
      setVideoPlaying(true);
    }, 1000);
  };

  const playApiAudio = async (langName) => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      return;
    }

    const langCodes = {
      English: 'en',
      Telugu: 'te',
      Hindi: 'hi',
      Kannada: 'kn',
      Tamil: 'ta',
      Malayalam: 'ml'
    };
    const code = langCodes[langName] || 'en';

    try {
      setAudioGenerating(true);
      setErrorMessage("Generating audio in " + langName + "...");
      const res = await getExplanationAudio(sessionId, code);
      setErrorMessage("");
      setAudioGenerating(false);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(res.audio_url);
      audio.volume = audioVolume;
      audio.playbackRate = playbackSpeed;
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.onerror = () => {
        setErrorMessage("Failed to play generated audio.");
        setIsPlayingAudio(false);
      };

      audioRef.current = audio;
      setIsPlayingAudio(true);
      audio.play();
    } catch (err) {
      setAudioGenerating(false);
      const detail = err.message || "";
      if (detail.includes("Audio is not currently available")) {
        setErrorMessage("Audio is not currently available in this language. Please use the text explanation or select another language.");
      } else {
        setErrorMessage("Audio could not be generated. Please try again.");
      }
    }
  };

  const handleLanguageChange = async (newLang) => {
    setVoiceLang(newLang);
    if (!isApiMode) {
      if (isPlayingAudio) {
        const text = getVoiceScriptText(
          selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : 'high',
          newLang
        );
        playSpeaking(text, newLang);
      }
      return;
    }

    const langCodes = {
      English: 'en',
      Telugu: 'te',
      Hindi: 'hi',
      Kannada: 'kn',
      Tamil: 'ta',
      Malayalam: 'ml'
    };
    const code = langCodes[newLang] || 'en';
    
    try {
      setErrorMessage("Preparing explanation in " + newLang + "...");
      const res = await getLocalizedExplanation(sessionId, code);
      setApiResult(prev => ({
        ...prev,
        explanation: res.explanation,
        recommendedAction: res.recommendedAction,
        consistency_summary: res.consistency_summary,
        possible_change: res.possible_change,
        visual_features: res.visual_features,
        scenes: res.scenes
      }));
      setErrorMessage("");
      
      if (isPlayingAudio) {
        stopSpeaking();
        playApiAudio(newLang);
      }
    } catch (err) {
      setErrorMessage(`Translation failed: ${err.message}`);
    }
  };

  // Play speaking
  const playSpeaking = (text, langName) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    
    window.speechSynthesis.cancel(); // Stop active speaking

    const langCodes = {
      English: 'en-US',
      Telugu: 'te-IN',
      Hindi: 'hi-IN',
      Kannada: 'kn-IN',
      Tamil: 'ta-IN',
      Malayalam: 'ml-IN'
    };

    const code = langCodes[langName] || 'en-US';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = code;
    utterance.volume = videoMuted ? 0 : audioVolume;
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const baseLang = code.split('-')[0].toLowerCase();
    const voice = voices.find(v => v.lang.toLowerCase().startsWith(baseLang) || v.lang.toLowerCase().includes(baseLang));
    
    if (code !== 'en-US' && !voice) {
      if (showVideoModal) {
        setVideoVoiceUnavailable(true);
      } else {
        setErrorMessage("Audio is not currently available in this language.");
      }
      setIsPlayingAudio(false);
      return;
    } else {
      setVideoVoiceUnavailable(false);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    utteranceRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Get script text
  const getVoiceScriptText = (riskType, lang) => {
    const greetings = {
      English: `Hello ${patientName || 'User'}. Your screening result is ready. `,
      Telugu: `నమస్కారం ${patientName || 'యూజర్'}. మీ పరీక్షా ఫలితం సిద్ధంగా ఉంది. `,
      Hindi: `नमस्ते ${patientName || 'यूज़र'}। आपका परिणाम तैयार है। `,
      Kannada: `ನಮಸ್ಕಾರ ${patientName || 'ಬಳಕೆದಾರ'}. ನಿಮ್ಮ ತಪಾಸಣಾ ಫಲಿತಾಂಶ ಸಿದ್ಧವಾಗಿದೆ. `,
      Tamil: `வணக்கம் ${patientName || 'பயனர்'}. உங்கள் முடிவுகள் தயாராக உள்ளன. `,
      Malayalam: `నമസ്കാരം ${patientName || 'ഉപയോക്താവ്'}. നിങ്ങളുടെ പരിശോധനാ ഫലം തയ്യാറാണ്. `
    };

    const prefix = greetings[lang] || greetings.English;
    const body = voiceTranslations[lang]?.[riskType] || voiceTranslations.English[riskType];
    return prefix + body;
  };

  // Video scene scripts
  const getVideoSceneScripts = (riskType, lang) => {
    if (isApiMode && apiResult && apiResult.scenes && apiResult.scenes[videoCurrentScene]) {
      return apiResult.scenes[videoCurrentScene];
    }
    const data = {
      English: {
        1: "Your AI screening is complete.",
        2: `You uploaded ${uploadedImages.length} images for analysis.`,
        3: "The AI observed some visual characteristics on your skin spot.",
        4: "Let's review what these visual patterns mean.",
        5: "Please note, this screening is not a medical diagnosis.",
        6: `We recommend taking the next step: ${currentCase.nextStep}`,
        7: "Your full report is ready on the dashboard. You can export a summary now."
      },
      Telugu: {
        1: "మీ ఎఐ పరీక్ష విజయవంతంగా పూర్తయింది.",
        2: `మీరు విశ్లేషణ కోసం ${uploadedImages.length} చిత్రాలను అప్‌లోడ్ చేశారు.`,
        3: "ఎఐ మీ చర్మంపై కొన్ని ముఖ్యమైన మార్పులను గుర్తించింది.",
        4: "ఈ మార్పులు దేనికి దారితీస్తాయో తెలుసుకుందాం.",
        5: "దయచేసి గమనించండి, ఈ పరీక్ష ఖచ్చితమైన రోగ నిర్ధారణ కాదు.",
        6: `మేము తదుపరి చర్యను సిఫార్సు చేస్తున్నాము.`,
        7: "మీ పూర్తి నివేదిక సిద్ధంగా ఉంది. మీరు డాక్టర్ సారాంశాన్ని డౌన్లోడ్ చేసుకోవచ్చు."
      },
      Hindi: {
        1: "आपकी एआई त्वचा जांच पूरी हो गई है।",
        2: `आपने जांच के लिए ${uploadedImages.length} चित्र अपलोड किए हैं।`,
        3: "एआई ने आपकी त्वचा के धब्बे पर कुछ दृश्य लक्षण देखे हैं।",
        4: "आइए देखें कि इन पैटर्न का क्या अर्थ है।",
        5: "कृपया ध्यान दें, यह जांच कोई डॉक्टरी निदान नहीं है।",
        6: `हम आपको अगला कदम उठाने की सलाह देते हैं।`,
        7: "आपकी पूरी रिपोर्ट डैशबोर्ड पर तैयार है। आप डॉक्टर सारांश निर्यात कर सकते हैं।"
      },
      Kannada: {
        1: "ನಿಮ್ಮ ಎಐ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ.",
        2: `ನಿವು ವಿಶ್ಲೇಷಣೆಗಾಗಿ ${uploadedImages.length} ಚಿತ್ರಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿದ್ದೀರಿ.`,
        3: "ಎಐ ನಿಮ್ಮ ಚರ್ಮದಲ್ಲಿ ಕೆಲವು ಪ್ರಮುಖ ಬದಲಾವಣೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿದೆ.",
        4: "ಈ ಬದಲಾವಣೆಗಳು ಏನನ್ನು ಸೂಚಿಸುತ್ತವೆ ಎಂದು ನೋಡೋಣ.",
        5: "ದಯವಿಟ್ಟು ಗಮನಿಸಿ, ಇದು ಅಧಿಕೃತ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
        6: `ನಾವು ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಲಹೆ ನೀಡುತ್ತೇವೆ.`,
        7: "ನಿಮ್ಮ ವರದಿ ಸಿದ್ಧವಾಗಿದೆ. ನೀವು ಸಾರಾಂಶವನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಬಹುದು."
      },
      Tamil: {
        1: "உங்கள் ஏஐ தோல் பரிசோதனை முடிந்தது.",
        2: `பரிசோதனைக்காக நீங்கள் ${uploadedImages.length} படங்களை பதிவேற்றியுள்ளீர்கள்.`,
        3: "ஏஐ உங்கள் தோலில் சில மாற்றங்களைக் கண்டறிந்துள்ளது.",
        4: "இந்த மாற்றங்கள் எதைக் குறிக்கின்றன என்று பார்ப்போம்.",
        5: "தயவுசெய்து கவனிக்கவும், ಇದು ஒரு மருத்துவ நோய் கண்டறிதல் அல்ல.",
        6: `தோல் மருத்துவரை அணுகி ஆலோசனை பெறுவது நல்லது.`,
        7: "உங்கள் அறிக்கை தயாராக உள்ளது. நீங்கள் இறுதி ಸಾರಾಂಶವನ್ನು பதிவிறக்கலாம்."
      },
      Malayalam: {
        1: "നിങ്ങളുടെ എഐ പരിശോധന പൂർത്തിയായായിരിക്കുന്നു.",
        2: `നിങ്ങൾ വിശകലനത്തിനായി ${uploadedImages.length} ചിത്രങ്ങൾ അപ്ലോഡ് ചെയ്തു.`,
        3: "എഐ നിങ്ങളുടെ ചർമ്മത്തിൽ ചില ലക്ഷണങ്ങൾ കണ്ടെത്തിയിട്ടുണ്ട്.",
        4: "ഈ ലക്ഷണങ്ങൾ എന്താണ് അർത്ഥമാക്കുന്നത് എന്ന് നോക്കാം.",
        5: "ദയവായി ഓർക്കുക, ഇത് ഒരു ഡോക്ടറുടെ രോഗനിർണ്ണയമല്ല.",
        6: `നിങ്ങൾ ഒരു ചർമ്മരോഗ വിദഗ്ദ്ധന്റെ സേവനം തേടുക.`,
        7: "നിങ്ങളുടെ പൂർണ്ണ റിപ്പോർട്ട് തയ്യാറാണ്. നിങ്ങൾക്ക് സംഗ്രഹം ഡൗൺലോഡ് ചെയ്യാം."
      }
    };
    return data[lang]?.[videoCurrentScene] || data.English[videoCurrentScene];
  };

  // Video scene player effects
  useEffect(() => {
    let timer;
    if (videoPlaying && showVideoModal) {
      const sceneText = getVideoSceneScripts(
        selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : selectedCaseId === 'case-03' ? 'uncertain' : 'high',
        voiceLang
      );
      playSpeaking(sceneText, voiceLang);

      timer = setTimeout(() => {
        if (videoCurrentScene < 7) {
          setVideoCurrentScene(prev => prev + 1);
        } else {
          setVideoPlaying(false);
          stopSpeaking();
        }
      }, 5500);
    }
    return () => clearTimeout(timer);
  }, [videoPlaying, videoCurrentScene, showVideoModal]);

  // Speech Recognition trigger
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please use the quick question chips below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLang === 'English' ? 'en-US' : voiceLang === 'Hindi' ? 'hi-IN' : voiceLang === 'Telugu' ? 'te-IN' : voiceLang === 'Kannada' ? 'kn-IN' : voiceLang === 'Tamil' ? 'ta-IN' : voiceLang === 'Malayalam' ? 'ml-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListeningMic(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      handleVoiceQuerySubmit(text);
    };

    recognition.onerror = () => {
      setIsListeningMic(false);
    };

    recognition.onend = () => {
      setIsListeningMic(false);
    };

    recognition.start();
  };

  // Voice Chat processors
  const handleVoiceQuerySubmit = (text) => {
    setIsListeningMic(false);
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = text.toLowerCase();
      
      if (lower.includes("bleed") || lower.includes("pain") || lower.includes("hurt") || lower.includes("infection") || lower.includes("severe")) {
        reply = "Concerning symptoms such as heavy bleeding, severe pain, or rapid structural changes require immediate professional medical attention. Please consult a qualified dermatologist or visit an urgent care center promptly. AI screening cannot replace clinical diagnosis.";
      } else if (lower.includes("moderate") || lower.includes("mean") || lower.includes("serious")) {
        reply = "Moderate indication means that the AI model detected visual characteristics (such as border asymmetry or pigment variations) that warrant a dermatologist evaluation. It does not confirm cancer. Consider creating a Doctor Summary report.";
      } else if (lower.includes("what should i do") || lower.includes("next step")) {
        reply = "We recommend exporting the doctor summary PDF from your dashboard and scheduling an appointment with a qualified dermatologist for a clinical review.";
      } else if (lower.includes("simple") || lower.includes("explain")) {
        reply = `The AI looked at your uploaded images. It noticed ${selectedCaseId === 'case-01' ? 'a stable, even freckle pattern' : 'some border asymmetry and color differences'}. This is just a screening, not a doctor's diagnosis.`;
      } else {
        reply = `Regarding '${text}': Based on the screening, the spot shows ${selectedCaseId === 'case-01' ? 'low risk indicators' : 'atypical visual patterns'}. We advise continuing monitoring or scheduling a dermatology visit if you are concerned.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setIsTyping(false);
      playSpeaking(reply, voiceLang);
    }, 1000);
  };

  // Individual Details Accordion on results tab
  const [showIndividualDetails, setShowIndividualDetails] = useState(false);

  // Previous/Current image tags
  const [prevCurrentTags, setPrevCurrentTags] = useState({}); // { id: 'previous' | 'current' }

  // Reset variables when switching cases
  useEffect(() => {
    if (defaultApiMode) {
      setUploadedImages([]);
      setScreeningState('idle');
      setZoomScale(1);
      setRotateDeg(0);
      setErrorMessage('');
      setDuplicateMessage('');
      setDuplicateFilesPending([]);
      setReplacingImageId(null);
      setIsApiMode(true);
      setSessionId(null);
      setApiResult(null);
      setProcessing(false);
      
      setActiveViewerImg('');
      setCompareLeft('');
      setCompareRight('');
      setIsCompareMode(false);
      setPrevCurrentTags({});
      setChatMessages([
        { sender: 'bot', text: `Hi! Welcome to DermaLens AI. Please upload up to 5 images of the skin area you would like to screen.` }
      ]);
    } else {
      setUploadedImages([...currentCase.images]);
      setScreeningState('idle');
      setZoomScale(1);
      setRotateDeg(0);
      setErrorMessage('');
      setDuplicateMessage('');
      setDuplicateFilesPending([]);
      setReplacingImageId(null);
      setIsApiMode(false);
      setSessionId(null);
      setApiResult(null);
      setProcessing(false);
      
      setActiveViewerImg(currentCase.images[0]?.src || '');
      setCompareLeft(currentCase.images[0]?.src || '');
      setCompareRight(currentCase.images[1]?.src || '');
      setIsCompareMode(false);
      setPrevCurrentTags({});
      setChatMessages([
        { sender: 'bot', text: `Hi! I've preloaded the multi-image dataset for ${currentCase.name}. How can I assist you with this analysis?` }
      ]);
      setSelectedMapSpot(currentCase.location);
    }
  }, [selectedCaseId, defaultApiMode]);

  useEffect(() => {
    if (activeTab === 'doctoreport' && isApiMode && sessionId) {
      generateDoctorReport(sessionId).catch(() => {});
    }
  }, [activeTab, isApiMode, sessionId]);

  // Trigger file input click safely
  const triggerChooseOrAddMore = () => {
    setReplacingImageId(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input value to guarantee change event triggers
      fileInputRef.current.click();
    }
  };

  // Trigger Replace on specific card
  const triggerReplace = (id) => {
    setReplacingImageId(id);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input value
      fileInputRef.current.click();
    }
  };

  // Process files dropped or selected via file picker
  const processFiles = async (files) => {
    setErrorMessage('');
    
    // Switch to API mode since user selected their own file
    if (!isApiMode) {
      setIsApiMode(true);
      setUploadedImages([]);
      setSessionId(null);
      setApiResult(null);
    }

    // If replacing, handle first file immediately
    if (replacingImageId !== null) {
      const file = files[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please select an image file.");
        setReplacingImageId(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("This image is too large. Please choose a smaller image.");
        setReplacingImageId(null);
        return;
      }

      const isDuplicate = uploadedImages.some(img => img.id !== replacingImageId && img.file && img.file.name === file.name && img.file.size === file.size);
      if (isDuplicate) {
        setErrorMessage("This image has already been selected.");
        setReplacingImageId(null);
        return;
      }

      const updated = uploadedImages.map(img => {
        if (img.id === replacingImageId) {
          return {
            ...img,
            src: URL.createObjectURL(file),
            file: file
          };
        }
        return img;
      });
      setUploadedImages(updated);
      setReplacingImageId(null);
      return;
    }

    const validFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Please select an image file.");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("This image is too large. Please choose a smaller image.");
        continue;
      }

      const isDuplicate = uploadedImages.some(img => img.file && img.file.name === file.name && img.file.size === file.size);
      if (isDuplicate) {
        setErrorMessage("This image has already been selected.");
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots = 5 - uploadedImages.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      const newImages = filesToAdd.map((file, index) => {
        const url = URL.createObjectURL(file);
        return {
          id: `local-file-${Date.now()}-${index}`,
          num: uploadedImages.length + index + 1,
          type: `View ${uploadedImages.length + index + 1}`,
          angle: `View ${uploadedImages.length + index + 1}`,
          src: url,
          file: file
        };
      });
      setUploadedImages(prev => [...prev, ...newImages]);
    }

    if (validFiles.length > remainingSlots) {
      setErrorMessage("Maximum 5 images per screening.");
    }
  };

  // React Input onChange Handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      // ALWAYS reset value immediately so the change event fires again if same file is selected later
      e.target.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Duplicate Resolution Handlers
  const handleKeepDuplicate = () => {
    const remainingSlots = 5 - uploadedImages.length;
    const filesToAdd = duplicateFilesPending.slice(0, remainingSlots);

    const newImages = filesToAdd.map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: `img-upload-dup-${Date.now()}-${index}`,
        num: uploadedImages.length + index + 1,
        type: "Close-up",
        date: "Aug 08, 2026",
        src: url,
        fileName: file.name,
        fileSize: file.size,
        qCheck: { 
          resolution: "3200x2400", 
          blur: "<Check size={14} /> Good", 
          brightness: "<Check size={14} /> Good", 
          contrast: "<Check size={14} /> Good", 
          visibility: "<Check size={14} /> Good", 
          duplicate: "<Check size={14} /> Unique", 
          angle: "<Check size={14} /> Normal", 
          obstruction: "<Check size={14} /> None" 
        }
      };
    });

    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
    }
    setDuplicateFilesPending([]);
    setDuplicateMessage('');
  };

  const handleRemoveDuplicate = () => {
    // If case-02 preloaded duplicate is flagged
    if (selectedCaseId === 'case-02') {
      setUploadedImages(prev => prev.filter(img => img.id !== "img-3").map((img, i) => ({ ...img, num: i + 1 })));
    }
    setDuplicateFilesPending([]);
    setDuplicateMessage('');
  };

  const startCamera = async () => {
    setCameraPermissionDenied(false);
    setCameraInitError(null);
    setIsCameraActive(false);
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn("Rear camera not available, trying default video input", err);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermissionDenied(true);
      } else {
        setCameraInitError("Unable to access the camera. Please check your camera permission and try again.");
      }
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [showCameraModal]);

  // Camera Capture Action
  const handleCameraCapture = () => {
    if (!videoRef.current || !isCameraActive) return;

    let currentUploadedImages = uploadedImages;
    if (!isApiMode) {
      setIsApiMode(true);
      currentUploadedImages = []; // Clear mock/loaded data when starting user-initiated session
      setSessionId(null);
      setApiResult(null);
    }

    if (currentUploadedImages.length >= 5) {
      setErrorMessage("Maximum 5 images allowed.");
      setShowCameraModal(false);
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCameraInitError("Could not initialize 2D context for image capture.");
        return;
      }
      
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      const filename = `captured_spot_${Date.now()}.jpg`;
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], filename, { type: mime });
      const url = URL.createObjectURL(file);

      const isDuplicate = currentUploadedImages.some(img => img.file && img.file.name === file.name && img.file.size === file.size);
      if (isDuplicate) {
        setErrorMessage("This image has already been selected.");
        setShowCameraModal(false);
        return;
      }

      const newImage = {
        id: `local-cam-${Date.now()}`,
        num: currentUploadedImages.length + 1,
        type: `View ${currentUploadedImages.length + 1}`,
        angle: `View ${currentUploadedImages.length + 1}`,
        src: url,
        file: file
      };

      setUploadedImages([...currentUploadedImages, newImage]);
      setShowCameraModal(false);
    } catch (e) {
      console.error("Error capturing spot:", e);
      setCameraInitError("Failed to capture image from camera stream.");
    }
  };

  // Toggle optional previous/current tags
  const toggleTag = (id, tag) => {
    setPrevCurrentTags(prev => {
      const currentTag = prev[id];
      if (currentTag === tag) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      } else {
        return { ...prev, [id]: tag };
      }
    });
  };

  // Remove all images
  const handleRemoveAll = () => {
    setUploadedImages([]);
    setPrevCurrentTags({});
    setErrorMessage('');
    setDuplicateMessage('');
    setDuplicateFilesPending([]);
  };

  // Delete individual image
  const handleDeleteImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id).map((img, i) => ({ ...img, num: i + 1 })));
    setErrorMessage('');
  };

  // Trigger Image Set Validation Check simulation
  const startValidationCheck = () => {
    if (processing) return;
    if (uploadedImages.length === 0) {
      setErrorMessage("Please choose at least 1 image to analyze.");
      return;
    }
    setProcessing(true);
    setScreeningState('checking-set');
    setScanProgressPct(0);
    setErrorMessage("");

    let progressDone = false;
    let apiDone = false;
    let apiError = null;

    const checkCompletion = () => {
      if (progressDone && apiDone) {
        if (apiError) {
          setErrorMessage(`Validation failed: ${apiError.message}`);
          setScreeningState('idle');
          setProcessing(false);
        } else {
          setScreeningState('checked');
          setProcessing(false);
        }
      }
    };

    const interval = setInterval(() => {
      setScanProgressPct(prev => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          progressDone = true;
          checkCompletion();
          return 100;
        }
      });
    }, 150);

    // Upload files in parallel if we are in API mode
    const newLocalFiles = uploadedImages.filter(img => img.file).map(img => img.file);
    if (isApiMode && newLocalFiles.length > 0) {
      uploadScreeningImages(newLocalFiles, sessionId)
        .then(async (res) => {
          setSessionId(res.session_id);
          const resultRes = await getScreeningResult(res.session_id);
          setUploadedImages(resultRes.images);
          apiDone = true;
          checkCompletion();
        })
        .catch(err => {
          apiError = err;
          apiDone = true;
          checkCompletion();
        });
    } else {
      apiDone = true;
      checkCompletion();
    }
  };

  // Trigger Multi-Image Scanning Pipeline
  const runMultiPipelineAnalysis = async () => {
    if (!isApiMode) {
      setScreeningState('scanning');
      setPipelineStep(0);
      setScanProgressPct(0);

      const steps = [
        "IMAGE VALIDATION",
        "IMAGE PREPROCESSING",
        "OPENCV PREPROCESSING",
        "FEATURE EXTRACTION",
        "MOBILENET / CNN MODEL SCREENING",
        "CROSS-IMAGE CONSISTENCY CHECK",
        "MULTI-IMAGE AGGREGATION & SUMMARY GENERATION"
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setPipelineStep(currentStep);
          setScanProgressPct(Math.round(((currentStep + 1) / steps.length) * 100));
          currentStep++;
        } else {
          clearInterval(interval);
          setScreeningState('complete');
          setProcessing(false);
        }
      }, 700);
      return;
    }

    // API Mode
    setScreeningState('scanning');
    setPipelineStep(0);
    setScanProgressPct(0);
    setErrorMessage("");

    let apiComplete = false;
    let apiError = null;

    runScreeningAnalysis(sessionId, uploadedImages.map(img => img.id))
      .then(async () => {
        const res = await getScreeningResult(sessionId);
        setUploadedImages(res.images);
        setApiResult(res.result);
        apiComplete = true;
      })
      .catch(err => {
        apiError = err;
        apiComplete = true;
        setErrorMessage(`Screening analysis failed: ${err.message}`);
      })
      .finally(() => {
        setProcessing(false);
      });

    const steps = [
      "IMAGE VALIDATION",
      "IMAGE PREPROCESSING",
      "OPENCV PREPROCESSING",
      "FEATURE EXTRACTION",
      "MOBILENET / CNN MODEL SCREENING",
      "CROSS-IMAGE CONSISTENCY CHECK",
      "MULTI-IMAGE AGGREGATION & SUMMARY GENERATION"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setPipelineStep(currentStep);
        setScanProgressPct(Math.round(((currentStep + 1) / steps.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        if (apiComplete) {
          setScreeningState('complete');
        } else {
          const waitInterval = setInterval(() => {
            if (apiComplete) {
              clearInterval(waitInterval);
              setScreeningState('complete');
            }
          }, 200);
        }
      }
    }, 700);


  };

  // Check warnings
  const getQualityWarnings = () => {
    return uploadedImages.filter(img => 
      img.qCheck && (
        img.qCheck.blur.includes("<X size={14} />") || 
        img.qCheck.brightness.includes("<AlertTriangle size={14} />") || 
        img.qCheck.angle.includes("<AlertTriangle size={14} />") || 
        img.qCheck.visibility.includes("<X size={14} />")
      )
    );
  };

  // RAG responses
  const triggerRAGResponse = async (question, answer, sources) => {
    if (isApiMode) {
      setChatMessages(prev => [...prev, { sender: 'user', text: question }]);
      setIsTyping(true);
      setRagPipelineStep(1);
      setActiveSources(sources || []);

      try {
        const langCodes = {
          English: 'en',
          Telugu: 'te',
          Hindi: 'hi',
          Kannada: 'kn',
          Tamil: 'ta',
          Malayalam: 'ml'
        };
        const code = langCodes[voiceLang] || 'en';
        const res = await askRAGQuestion(question, code);
        setRagPipelineStep(4);
        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: 'bot', text: res.answer, sources: res.sources }]);
        playSpeaking(res.answer, voiceLang);
      } catch (err) {
        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: 'bot', text: answer, sources }]);
        playSpeaking(answer, voiceLang);
      }
      return;
    }

    setChatMessages(prev => [...prev, { sender: 'user', text: question }]);
    setIsTyping(true);
    setRagPipelineStep(1);
    setActiveSources(sources || []);

    setTimeout(() => {
      setRagPipelineStep(2);
      setTimeout(() => {
        setRagPipelineStep(3);
        setTimeout(() => {
          setRagPipelineStep(4);
          setIsTyping(false);
          setChatMessages(prev => [...prev, { sender: 'bot', text: answer, sources }]);
          playSpeaking(answer, voiceLang);
        }, 1000);
      }, 800);
    }, 800);
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQ = chatInput.trim();
    setChatInput('');

    if (isApiMode) {
      setChatMessages(prev => [...prev, { sender: 'user', text: userQ }]);
      setIsTyping(true);
      setRagPipelineStep(1);

      try {
        const langCodes = {
          English: 'en',
          Telugu: 'te',
          Hindi: 'hi',
          Kannada: 'kn',
          Tamil: 'ta',
          Malayalam: 'ml'
        };
        const code = langCodes[voiceLang] || 'en';
        
        const res = await askLensAI(sessionId, userQ, code);
        setIsTyping(false);
        setRagPipelineStep(4);
        setChatMessages(prev => [...prev, { sender: 'bot', text: res.answer }]);
        playSpeaking(res.answer, voiceLang);
      } catch (err) {
        setIsTyping(false);
        setChatMessages(prev => [...prev, { sender: 'bot', text: "Unable to reach Lens AI service at this time." }]);
      }
      return;
    }

    const matched = ragQA.find(q => q.question.toLowerCase().includes(userQ.toLowerCase()) || userQ.toLowerCase().includes(q.question.toLowerCase()));
    
    if (matched) {
      triggerRAGResponse(matched.question, matched.answer, matched.sources);
    } else {
      triggerRAGResponse(
        userQ, 
        "Model classification analysis highlights asymmetrical border structures, and RAG references suggest consulting a dermatologist if these changes evolve over time.",
        [{ title: "Guidelines on Teledermatology Assessment Protocols", author: "Dermatological Review", year: "2024" }]
      );
    }
  };

  const getSymmetryStatus = () => {
    if (isApiMode && apiResult) return apiResult.visual_features.asymmetry;
    if (selectedCaseId === 'case-01') return "Regular";
    return "Variation observed";
  };

  const getBorderStatus = () => {
    if (isApiMode && apiResult) return apiResult.visual_features.border;
    if (selectedCaseId === 'case-01') return "Regular";
    return "Variation observed";
  };

  const getColorStatus = () => {
    if (isApiMode && apiResult) return apiResult.visual_features.color;
    if (selectedCaseId === 'case-01') return "Single dominant color";
    return "Multiple colors observed";
  };

  const getTextureStatus = () => {
    if (isApiMode && apiResult) return apiResult.visual_features.texture;
    if (selectedCaseId === 'case-01') return "Uniform";
    return "Variation observed";
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 5rem' }}>
      
      {/* Hidden File input used for all uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      {/* JUDGE PROTO SANDBOX CONTROLLER */}
      <div className="glass-card" style={{ background: 'var(--primary-teal)', color: '#FFF', marginBottom: '2.5rem', padding: '1.5rem 2rem', border: 'none', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.4rem 1rem', background: 'var(--accent-coral)', fontSize: '0.7rem', fontWeight: 'bold', borderBottomLeftRadius: '10px' }}>
          JUDGE PROTO Sandbox
        </div>
        <h3 style={{ color: '#FFF', marginBottom: '0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} style={{ color: 'var(--accent-aqua)' }} />
          DermaLens AI â€” Multi-Image Upload Sandbox
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem', maxWidth: '850px' }}>
          Switch scenarios below to test visual variables. Case 2 triggers duplicate warning flags (Image 2 and 3 are similar). Case 3 illustrates Uncertain Signal safeguards.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {demoCases.map(c => (
            <button
              key={c.id}
              className={`btn ${selectedCaseId === c.id ? 'btn-accent' : 'btn-glass'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
              onClick={() => setSelectedCaseId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* WORKSPACE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2.5rem' }}>
        
        {/* Workspace Sidebar Nav */}
        <div>
          <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>SCREENING CONSOLE</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {[
                { id: 'scan', label: 'AI Screening', icon: <Camera size={16} /> },
                { id: 'history', label: 'My History', icon: <Clock size={16} /> },
                { id: 'story', label: 'Skin Story', icon: <History size={16} /> },
                { id: 'compare', label: 'Compare Changes', icon: <Scale size={16} /> },
                { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={16} /> },
                { id: 'doctoreport', label: 'Doctor Summary', icon: <FileText size={16} /> },
                { id: 'dataset', label: 'Dataset Stats', icon: <Database size={16} /> }
              ].map(t => (
                <button
                  key={t.id}
                  className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.7rem 1.25rem', fontSize: '0.9rem', width: '100%' }}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-gray)', lineHeight: '1.4' }}>
              <p style={{ fontWeight: 'bold', color: 'var(--accent-coral)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Shield size={12} /> CLINICAL POLICY
              </p>
              "Multiple images can provide additional visual information and help the AI evaluate consistency across views. AI screening cannot replace professional diagnosis."
            </div>
          </div>
        </div>

        {/* Dashboard Tab Panels */}
        <div className="glass-card" style={{ background: '#FFFFFF', minHeight: '600px', padding: '2.5rem' }}>
          
          {/* TAB: SCREENING WORKFLOW */}
          {activeTab === 'scan' && (
            <div>
              {/* IDLE UPLOAD PAGE */}
              {screeningState === 'idle' && (
                <div>
                  <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h2>AI MULTI-IMAGE SCREENING</h2>
                    <h3 style={{ color: 'var(--primary-teal)', marginTop: '0.5rem' }}>Upload all your images at once.</h3>
                    <p style={{ color: 'var(--text-gray)' }}>Give DermaLens multiple views of the same skin area so the AI can analyze the available visual information together.</p>
                  </div>

                  {/* VISIBLE ERROR BANNERS */}
                  {errorMessage && (
                    <div style={{ background: 'rgba(231,111,81,0.06)', borderLeft: '5px solid var(--accent-coral)', color: 'var(--accent-coral)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {errorMessage}
                    </div>
                  )}

                  {/* Large Drag and Drop Upload Area (Only displayed when 0 images are uploaded) */}
                  {uploadedImages.length === 0 ? (
                    <div>
                      <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={{ border: '2.5px dashed rgba(15,76,92,0.15)', borderRadius: 'var(--border-radius-lg)', padding: '3.5rem 2rem', textAlign: 'center', background: 'var(--bg-warm-ivory)', marginBottom: '2rem', position: 'relative' }}
                      >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <Upload size={24} className="gradient-text" />
                        </div>
                        
                        <h4 style={{ textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>SEE THE WHOLE PICTURE</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                          Upload multiple views of the same skin area for AI-assisted screening.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                          <button className="btn btn-primary" onClick={triggerChooseOrAddMore}>
                            <Upload size={14} style={{ marginRight: '4px' }} /> Choose Images
                          </button>
                          <button className="btn btn-secondary" onClick={() => setShowCameraModal(true)}>
                            Take Photo
                          </button>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', marginTop: '1.5rem' }}>Drag & Drop Images</p>
                      </div>

                      <div style={{ textAlign: 'center', color: 'var(--text-gray)', fontSize: '0.85rem' }}>
                        <div>Up to 5 images</div>
                        <div style={{ fontWeight: 'bold', marginTop: '0.25rem' }}>0 / 5 images</div>
                      </div>
                    </div>
                  ) : (
                    /* YOUR IMAGE SET (Displayed when images are present) */
                    <div>
                      <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>YOUR IMAGE SET</h4>
                      </div>

                      {/* Previews grid (Responsive structure classes mapped from index.css) */}
                      <div className="upload-grid">
                        {uploadedImages.map((img) => (
                          <div key={img.id} className="glass-card" style={{ padding: '0.75rem', background: '#FFF', border: '1px solid rgba(15,76,92,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                            <div style={{ position: 'relative', width: '100%', height: '110px', background: 'var(--bg-warm-ivory)', borderRadius: '6px', overflow: 'hidden' }}>
                              <img src={img.src} alt={`View ${img.num}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              <button 
                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(231,111,81,0.9)', color: '#FFF', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem' }}
                                onClick={() => handleDeleteImage(img.id)}
                                title="Remove Image"
                              >
                                <X size={14} />
                              </button>
                              <span style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'rgba(15,76,92,0.85)', color: '#FFF', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                                IMG {img.num}
                              </span>
                            </div>

                            {/* Optional Previous / Current tags */}
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button 
                                className={`btn ${prevCurrentTags[img.id] === 'previous' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.2rem', fontSize: '0.65rem', flex: 1, borderRadius: '3px', height: '24px' }}
                                onClick={() => toggleTag(img.id, 'previous')}
                              >
                                Prev
                              </button>
                              <button 
                                className={`btn ${prevCurrentTags[img.id] === 'current' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ padding: '0.2rem', fontSize: '0.65rem', flex: 1, borderRadius: '3px', height: '24px' }}
                                onClick={() => toggleTag(img.id, 'current')}
                              >
                                Curr
                              </button>
                            </div>

                            {/* Angle selection dropdown */}
                            {isApiMode && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.2rem' }}>
                                <select 
                                  value={img.angle || 'Unknown / Unspecified'}
                                  onChange={async (e) => {
                                    const val = e.target.value;
                                    setUploadedImages(prev => prev.map(item => item.id === img.id ? { ...item, angle: val } : item));
                                    try {
                                      await updateImageMetadata(img.id, val, img.type || 'Close-up');
                                    } catch (err) {
                                      console.error("Failed to update image angle:", err);
                                    }
                                  }}
                                  style={{ width: '100%', padding: '0.2rem', fontSize: '0.7rem', borderRadius: '4px', border: '1px solid rgba(15,76,92,0.15)', background: '#FFF' }}
                                >
                                  {['Unknown / Unspecified', 'Front', 'Left', 'Right', 'Top', 'Close-up', 'Wide/Overall'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-gray)', marginTop: '0.1rem' }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70px' }}>{img.fileName || "Set view"}</span>
                              <button 
                                style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', cursor: 'pointer', fontWeight: '600', padding: 0 }} 
                                onClick={() => triggerReplace(img.id)}
                              >
                                Replace
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Upload status checklist logs */}
                      <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.06)', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold', letterSpacing: '1px' }}>UPLOAD STATUS</span>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '0.5rem' }}>
                          <div>Preparing images...</div>
                          {uploadedImages.map(img => (
                            <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', color: 'var(--secondary-forest)', fontWeight: '500' }}>
                              <CheckCircle2 size={12} /> Image {img.num} <Check size={12} style={{ color: 'var(--secondary-forest)', marginRight: '4px' }} /> ready
                            </div>
                          ))}
                        </div>
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>
                          {uploadedImages.length} {uploadedImages.length === 1 ? 'image' : 'images'} ready for analysis.
                          {uploadedImages.length === 1 && (
                            <span style={{ fontWeight: 'normal', color: 'var(--text-gray)', marginLeft: '0.5rem' }}>
                              (More images can provide additional visual information.)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controls and Counters */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1ECE3', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>
                            {uploadedImages.length} / 5 images
                          </span>
                          {uploadedImages.length >= 5 ? (
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-coral)', fontWeight: 'bold' }}>
                              Maximum 5 images reached
                            </span>
                          ) : null}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <button className="btn btn-secondary" style={{ color: 'var(--accent-coral)' }} onClick={handleRemoveAll}>
                            Remove All
                          </button>
                          
                          <button 
                            className="btn btn-secondary" 
                            onClick={triggerChooseOrAddMore}
                            disabled={uploadedImages.length >= 5}
                            style={{ opacity: uploadedImages.length >= 5 ? 0.5 : 1, cursor: uploadedImages.length >= 5 ? 'not-allowed' : 'pointer' }}
                          >
                            + Add More Images
                          </button>

                          <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowCameraModal(true)} 
                            disabled={uploadedImages.length >= 5}
                            style={{ opacity: uploadedImages.length >= 5 ? 0.5 : 1, cursor: uploadedImages.length >= 5 ? 'not-allowed' : 'pointer' }}
                          >
                            <Camera size={14} style={{ marginRight: '4px' }} /> Take Photo
                          </button>
                          
                          <button className="btn btn-primary" onClick={startValidationCheck}>
                            Analyze Image Set â†’
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IMAGE SET VALIDATION CHECK */}
              {screeningState === 'checking-set' && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(15,76,92,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <RefreshCw size={32} className="gradient-text animate-spin" />
                  </div>
                  <h3>Checking your image set...</h3>
                  <div style={{ width: '300px', height: '6px', background: 'var(--bg-warm-ivory)', borderRadius: '3px', margin: '1rem auto 1.5rem', overflow: 'hidden' }}>
                    <div style={{ width: `${scanProgressPct}%`, height: '100%', background: 'var(--primary-teal)', transition: 'width 0.4s ease' }} />
                  </div>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>Verifying resolutions, lighting boundaries, blur limits, and duplicates...</p>
                </div>
              )}

              {/* VALIDATION RESULTS PAGE */}
              {screeningState === 'checked' && (
                <div>
                  <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Step 2: Image Set Validation Reports</h3>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setScreeningState('idle')}>
                      Back to Uploads
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {uploadedImages.map((img) => {
                      const hasWarning = img.qCheck.brightness.includes("<AlertTriangle size={14} />") || img.qCheck.blur.includes("<X size={14} />") || img.qCheck.duplicate.includes("<AlertTriangle size={14} />") || img.qCheck.angle.includes("<AlertTriangle size={14} />");
                      return (
                        <div key={img.id} className="glass-card" style={{ padding: '1.25rem', background: '#FFF', display: 'grid', gridTemplateColumns: '120px 1fr 1.2fr', gap: '2rem', alignItems: 'center' }}>
                          <div style={{ width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>

                          <div>
                            <strong>IMAGE {img.num}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                              Type: {img.type} | Resolution: {img.qCheck.resolution}
                            </div>
                          </div>

                          {/* Specific diagnostic listings */}
                          <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                              <div>Blur: <span style={{ fontWeight: '600', color: img.qCheck.blur.includes("<Check size={14} />") ? 'var(--secondary-forest)' : 'var(--accent-coral)' }}>{img.qCheck.blur}</span></div>
                              <div>Lighting: <span style={{ fontWeight: '600', color: img.qCheck.brightness.includes("<Check size={14} />") ? 'var(--secondary-forest)' : 'var(--accent-coral)' }}>{img.qCheck.brightness}</span></div>
                              <div>Contrast: <span style={{ fontWeight: '600', color: 'var(--secondary-forest)' }}>{img.qCheck.contrast}</span></div>
                              <div>Visibility: <span style={{ fontWeight: '600', color: img.qCheck.visibility.includes("<Check size={14} />") ? 'var(--secondary-forest)' : 'var(--accent-coral)' }}>{img.qCheck.visibility}</span></div>
                              <div>Angle: <span style={{ fontWeight: '600', color: img.qCheck.angle.includes("<Check size={14} />") ? 'var(--secondary-forest)' : 'var(--accent-coral)' }}>{img.qCheck.angle}</span></div>
                              <div>Duplicate: <span style={{ fontWeight: '600', color: img.qCheck.duplicate.includes("<Check size={14} />") ? 'var(--secondary-forest)' : 'var(--accent-coral)' }}>{img.qCheck.duplicate}</span></div>
                            </div>

                            {hasWarning && (
                              <div style={{ marginTop: '0.75rem', color: 'var(--accent-coral)', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                <AlertTriangle size={12} />
                                <span>Image {img.num} may provide limited visual information.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Set Quality summary card */}
                  <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.12)', padding: '1.5rem', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>IMAGE SET QUALITY</span>
                    <h3 style={{ color: 'var(--primary-teal)', margin: '0.25rem 0' }}>
                      {uploadedImages.length - getQualityWarnings().length} of {uploadedImages.length} images suitable for analysis.
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div>
                        <span>Overall quality: <strong>{getQualityWarnings().length > 1 ? 'POOR' : 'GOOD'}</strong></span>
                        {getQualityWarnings().length > 0 && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--accent-coral)', marginTop: '0.25rem', margin: 0 }}>
                            * Some uploaded views may contain excessive blur or lighting limitations.
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {getQualityWarnings().length > 0 && (
                          <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setScreeningState('idle')}>
                            Replace Image
                          </button>
                        )}
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={runMultiPipelineAnalysis}>
                          Continue With Suitable Images
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCANNING MULTI-IMAGE PIPELINE WORKFLOW */}
              {screeningState === 'scanning' && (
                <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
                  <h3>Running Multi-Image AI pipeline...</h3>
                  
                  {/* Pipeline Graph Animation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', margin: '2.5rem auto 1.5rem', textAlign: 'left' }}>
                    {[
                      "Image Set Loaded",
                      "Preprocessing & OpenCV Checks",
                      "MobileNet / CNN Feature Extraction",
                      "Cross-Image Consistency Analysis",
                      "Combined Granite Summary Output"
                    ].map((step, idx) => {
                      const active = idx === Math.min(Math.floor(pipelineStep / 1.5), 4);
                      const done = idx < Math.min(Math.floor(pipelineStep / 1.5), 4);
                      return (
                        <div key={idx} style={{ 
                          padding: '0.75rem 1rem', 
                          borderRadius: '6px', 
                          background: active ? 'var(--primary-teal)' : '#FFF',
                          color: active ? '#FFF' : 'var(--text-dark)',
                          border: '1px solid rgba(15,76,92,0.1)',
                          opacity: done ? 0.5 : 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{step}</span>
                          {done && <Check size={16} style={{ color: 'var(--secondary-forest)' }} />}
                          {active && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-coral)' }} className="pulse-coral-ring" />}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ width: '300px', height: '6px', background: 'var(--bg-warm-ivory)', borderRadius: '3px', margin: '0 auto 1.5rem', overflow: 'hidden' }}>
                    <div style={{ width: `${scanProgressPct}%`, height: '100%', background: 'var(--primary-teal)', transition: 'width 0.4s ease' }} />
                  </div>

                  <p style={{ color: 'var(--text-gray)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                    Processing step: {[
                      "Image Validation",
                      "Image Preprocessing",
                      "OpenCV",
                      "Feature Extraction",
                      "MobileNet / CNN",
                      "Cross-Image Consistency",
                      "Multi-Image Aggregation"
                    ][pipelineStep]}
                  </p>
                </div>
              )}

              {/* COMPLETE RESULT WORKSPACE */}
              {screeningState === 'complete' && (
                <div>
                  {/* Mode and Patient Name Selector */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(15,76,92,0.05)', padding: '0.75rem 1.25rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>Easy Mode (Simple View)</span>
                      <button 
                        className={`btn ${isEasyMode ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                        onClick={() => {
                          setIsEasyMode(!isEasyMode);
                          stopSpeaking();
                        }}
                      >
                        {isEasyMode ? "ON" : "OFF"}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                      Patient Name: 
                      <input 
                        type="text" 
                        value={patientName} 
                        onChange={(e) => setPatientName(e.target.value)} 
                        style={{ marginLeft: '0.5rem', padding: '0.2rem 0.4rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px', width: '80px', fontSize: '0.75rem' }} 
                        placeholder="Name"
                      />
                    </div>
                  </div>

                  {isEasyMode ? (
                    /* EASY / ELDERLY SIMPLE VIEW */
                    <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 1</span>
                        <h2 style={{ fontSize: '2rem', color: 'var(--primary-teal)', margin: '0.5rem 0' }}>Your images were checked.</h2>
                      </div>

                      <div style={{ textAlign: 'center', background: 'var(--bg-warm-ivory)', border: '2px solid var(--primary-teal)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 2</span>
                        <h3 style={{ fontSize: '1.75rem', color: 'var(--accent-coral)', margin: '0.5rem 0' }}>
                          Your AI screening result is:
                        </h3>
                        <h2 style={{ fontSize: '2.25rem', color: 'var(--primary-teal)', fontWeight: '800' }}>
                          {isApiMode && apiResult
                            ? getTranslatedRiskLabel(apiResult.overallResult, voiceLang)
                            : getTranslatedRiskLabel(selectedCaseId === 'case-01' ? 'LOW' : selectedCaseId === 'case-02' ? 'MODERATE' : selectedCaseId === 'case-03' ? 'UNCERTAIN' : 'HIGH', voiceLang)
                          }
                        </h2>
                      </div>

                      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', border: '1px solid rgba(0,0,0,0.1)', background: '#FFF' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 3</span>
                        <h3 style={{ margin: '0.5rem 0 1rem' }}>Listen to what this result means:</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '1rem 2.5rem', fontSize: '1.3rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', height: 'auto' }}
                            disabled={audioGenerating}
                            onClick={() => {
                              if (isApiMode) {
                                playApiAudio(voiceLang);
                              } else {
                                const scriptText = getVoiceScriptText(
                                  selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : selectedCaseId === 'case-03' ? 'uncertain' : 'high',
                                  voiceLang
                                );
                                isPlayingAudio ? stopSpeaking() : playSpeaking(scriptText, voiceLang);
                              }
                            }}
                          >
                            {audioGenerating ? "Generating audio..." : (isPlayingAudio ? "â�¸ Pause Voice Description" : "<Volume2 size={16} style={{ marginRight: '4px' }} /> Hear Result (Listen)")}
                          </button>

                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', height: 'auto' }}
                            onClick={handleWatchVideo}
                          >
                            <Video size={14} style={{ marginRight: '4px' }} /> Watch Visual Explanation
                          </button>
                        </div>
                      </div>

                      <div style={{ background: '#FFF', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '2rem' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--text-gray)', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP 4</span>
                        <h3 style={{ margin: '0.5rem 0 0.5rem', color: 'var(--primary-teal)' }}>Here is what you should do next:</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                          {isApiMode && apiResult
                            ? apiResult.recommendedAction
                            : (selectedCaseId === 'case-01'
                              ? "Continue routine monitoring and protect skin from excess UV exposure."
                              : selectedCaseId === 'case-02'
                              ? "Consider arranging a clinical evaluation with a qualified dermatologist."
                              : selectedCaseId === 'case-03'
                              ? "Capture clearer images or seek professional evaluation if concerned."
                              : "Arrange a professional medical evaluation promptly. Do not treat at home.")
                          }
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', height: 'auto', flex: 1, minWidth: '200px' }} onClick={() => setShowDoctorModal(true)}>
                          ðŸ”� Find Professional Doctors
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', height: 'auto', flex: 1, minWidth: '200px' }} onClick={() => setTab('doctoreport')}>
                          <FileText size={14} style={{ marginRight: '4px' }} /> Get Doctor Report
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', height: 'auto', flex: 1, minWidth: '200px', background: 'var(--accent-coral)', color: '#FFF' }} onClick={() => setShareWithDoctorOpen(true)}>
                          <Share2 size={14} style={{ marginRight: '4px' }} /> Share with Doctor
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STANDARD RESULTS VIEW */
                    <div>
                      {selectedCaseId === 'case-03' ? (
                        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0.5rem auto' }}>
                          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(128,128,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <AlertTriangle size={36} style={{ color: '#616161' }} />
                          </div>
                          <h2 style={{ color: 'var(--primary-teal)' }}>
                            SCREENING RESULT: {getTranslatedRiskLabel('UNCERTAIN', voiceLang)}
                          </h2>
                          
                          <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', textAlign: 'left', margin: '1.5rem 0', padding: '1.5rem' }}>
                            <strong style={{ fontSize: '0.95rem' }}>Why is the result uncertain?</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                              The system was unable to establish a consistent pattern classification due to one or more factors:
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              <li><strong>Poor image quality:</strong> Image #5 was flagged for motion blur.</li>
                              <li><strong>Insufficient usable images:</strong> Several shots had low visibility or uneven lighting focus.</li>
                              <li><strong>Different lighting:</strong> Contrast margins differed by more than 35% across views.</li>
                              <li><strong>Different camera angles:</strong> Side perspective and close-up views could not be geometrically aligned.</li>
                              <li><strong>Inconsistent AI outputs:</strong> Separate model layers returned conflicting visual classifications.</li>
                              <li><strong>Insufficient visual information:</strong> A clear obstruction check could not be ruled out.</li>
                            </ul>
                          </div>

                          <div style={{ borderTop: '1px solid #F1ECE3', paddingTop: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                            <strong style={{ color: 'var(--primary-teal)' }}>RECOMMENDED NEXT STEP:</strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '0.25rem', fontWeight: 'bold' }}>
                              "Capture clearer images or consider professional evaluation if the finding is concerning."
                            </p>
                          </div>

                          {/* Result-specific Supportive Wellness */}
                          <div className="glass-card" style={{ background: '#FFF', border: '1px solid rgba(15,76,92,0.12)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                              <HeartPulse size={18} style={{ color: 'var(--accent-coral)' }} />
                              Supportive Wellness
                            </h4>
                            <div style={{ background: 'rgba(231,111,81,0.05)', color: 'var(--accent-coral)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', margin: '0.75rem 0', borderLeft: '3.5px solid var(--accent-coral)', fontWeight: '500' }}>
                              "Traditional wellness information may be provided for general wellbeing, but it is not a treatment for skin cancer and should not replace professional medical care."
                            </div>
                            <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-teal)', margin: '0.5rem 0' }}>
                              "Improve image quality or seek professional evaluation if concerned."
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', margin: 0 }}>
                              * Before using Ayurvedic herbs, oils, supplements or other products, discuss them with a qualified healthcare professional. Natural does not automatically mean safe.
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => { setUploadedImages([]); setScreeningState('idle'); }}>
                              Retake Images
                            </button>
                            <button className="btn btn-primary" onClick={() => { setUploadedImages([]); setScreeningState('idle'); }}>
                              Upload Again
                            </button>
                            <button className="btn btn-secondary" onClick={() => setTab('doctoreport')}>
                              Create Doctor Summary
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* COMBINED SCREENING RESULT CARD (LOW, MODERATE, HIGH Indications) */
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '2.5rem' }}>
                            
                            {/* Left Result Details */}
                            <div>
                              
                              {/* 1. PERSONALIZED RESULT CARD */}
                              <div className="glass-card" style={{ background: '#FFF', border: '1px solid rgba(15,76,92,0.12)', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR RESULT IS READY</span>
                                
                                <h2 style={{ color: 'var(--primary-teal)', margin: '1rem 0 0.5rem', fontSize: '2rem', fontWeight: '800' }}>
                                  {isApiMode && apiResult
                                    ? getTranslatedRiskLabel(apiResult.overallResult, voiceLang)
                                    : getTranslatedRiskLabel(selectedCaseId === 'case-01' ? 'LOW' : selectedCaseId === 'case-02' ? 'MODERATE' : selectedCaseId === 'case-03' ? 'UNCERTAIN' : 'HIGH', voiceLang)
                                  }
                                </h2>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)', margin: '0 0 1.5rem' }}>
                                  {uploadedImages.length} images analyzed | AI consistency: <strong>{isApiMode && apiResult ? apiResult.ai_consistency : currentCase.consistency.status}</strong>
                                </p>

                                <hr style={{ border: 'none', borderTop: '1px solid #F1ECE3', margin: '1.5rem 0' }} />

                                <h4 style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>WHAT DID THE AI FIND?</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--secondary-forest)' }} />
                                    <span>Asymmetry: {getSymmetryStatus()}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--secondary-forest)' }} />
                                    <span>Border Variation: {getBorderStatus()}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--secondary-forest)' }} />
                                    <span>Color Variation: {getColorStatus()}</span>
                                  </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid #F1ECE3', margin: '1.5rem 0' }} />

                                <h4 style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>UNDERSTAND YOUR RESULT</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    onClick={() => alert('You are reading the report on the screen now. Scroll down for technical features and explanations.')}
                                  >
                                    <BookOpen size={14} style={{ marginRight: '4px' }} /> Read
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    disabled={audioGenerating}
                                    onClick={() => {
                                      if (isApiMode) {
                                        playApiAudio(voiceLang);
                                      } else {
                                        const text = getVoiceScriptText(
                                          selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : 'high',
                                          voiceLang
                                        );
                                        isPlayingAudio ? stopSpeaking() : playSpeaking(text, voiceLang);
                                      }
                                    }}
                                  >
                                    <Volume2 size={14} style={{ marginRight: "4px" }} /> {audioGenerating ? "Generating..." : (isPlayingAudio ? "Pause" : "Listen")}
                                  </button>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    onClick={handleWatchVideo}
                                  >
                                    <Video size={14} style={{ marginRight: '4px' }} /> Watch
                                  </button>
                                </div>

                                {/* AUDIO PLAYER CONTROLS */}
                                <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>
                                      <Volume2 size={14} style={{ marginRight: '4px' }} /> Screening Explanation ({voiceLang})
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: errorMessage && errorMessage.includes("not currently available") ? 'var(--accent-coral)' : 'var(--text-gray)' }}>
                                      {errorMessage && errorMessage.includes("not currently available") ? "<AlertTriangle size={14} />ï¸� Unsupported Language" : "ðŸ”Š Audio available"}
                                    </span>
                                  </div>

                                  {errorMessage && errorMessage.includes("Audio could not be generated") && (
                                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-coral)' }}>{errorMessage}</span>
                                      <button 
                                        className="btn btn-secondary" 
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', minWidth: 'auto', height: 'auto' }} 
                                        onClick={() => playApiAudio(voiceLang)}
                                      >
                                        Try Again
                                      </button>
                                    </div>
                                  )}

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0' }}>
                                    <button 
                                      style={{ background: 'var(--primary-teal)', color: '#FFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                      disabled={audioGenerating}
                                      onClick={() => {
                                        if (isApiMode) {
                                          playApiAudio(voiceLang);
                                        } else {
                                          const text = getVoiceScriptText(
                                            selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : 'high',
                                            voiceLang
                                          );
                                          isPlayingAudio ? stopSpeaking() : playSpeaking(text, voiceLang);
                                        }
                                      }}
                                    >
                                      {audioGenerating ? "â�³" : (isPlayingAudio ? "â�¸" : "â–¶")}
                                    </button>

                                    <button 
                                      style={{ background: 'var(--accent-coral)', color: '#FFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                      onClick={stopSpeaking}
                                      title="Stop"
                                    >
                                      â�¹
                                    </button>

                                    <div style={{ flex: 1, height: '4px', background: 'rgba(15,76,92,0.1)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: isPlayingAudio ? '55%' : '0%', background: 'var(--primary-teal)', transition: 'width 20s linear' }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                                      {isPlayingAudio ? "0:15" : "0:00"} / 0:45
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <span>Speed:</span>
                                      {[0.75, 1, 1.25, 1.5].map(s => (
                                        <button 
                                          key={s} 
                                          style={{ padding: '0.1rem 0.3rem', border: playbackSpeed === s ? '1px solid var(--primary-teal)' : 'none', background: playbackSpeed === s ? '#FFF' : 'none', color: 'var(--primary-teal)', fontWeight: playbackSpeed === s ? 'bold' : 'normal', cursor: 'pointer', borderRadius: '3px' }}
                                          onClick={() => {
                                            setPlaybackSpeed(s);
                                            if (isPlayingAudio) {
                                              const text = getVoiceScriptText(
                                                selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : 'high',
                                                voiceLang
                                              );
                                              playSpeaking(text, voiceLang);
                                            }
                                          }}
                                        >
                                          {s}x
                                        </button>
                                      ))}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                      <select 
                                        value={voiceLang} 
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        style={{ padding: '0.2rem', fontSize: '0.75rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px' }}
                                      >
                                        {['English', 'Telugu', 'Hindi', 'Kannada', 'Tamil', 'Malayalam'].map(l => (
                                          <option key={l} value={l}>{l}</option>
                                        ))}
                                      </select>
                                      
                                      <button 
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => {
                                          const text = getVoiceScriptText(
                                            selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : 'high',
                                            voiceLang
                                          );
                                          playSpeaking(text, voiceLang);
                                        }}
                                      >
                                        â�ª Replay
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <hr style={{ border: 'none', borderTop: '1px solid #F1ECE3', margin: '1.5rem 0' }} />

                                <h4 style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>WHAT SHOULD YOU DO?</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 'bold', textAlign: 'left', lineHeight: '1.4', margin: '0.5rem 0 1.5rem' }}>
                                  {isApiMode && apiResult
                                    ? apiResult.recommendedAction
                                    : (selectedCaseId === 'case-01' 
                                      ? "Focus on routine skin monitoring and healthy skin-care habits. Protect skin from excessive UV exposure."
                                      : selectedCaseId === 'case-02'
                                      ? "Consider arranging an evaluation with a qualified dermatologist, particularly if the area is new, changing, bleeding, painful, or concerning."
                                      : "Arrange professional medical evaluation promptly. Do not use home remedies or Ayurvedic products as a substitute for medical assessment or treatment.")
                                  }
                                </p>

                                <hr style={{ border: 'none', borderTop: '1px solid #F1ECE3', margin: '1.5rem 0' }} />

                                <h4 style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>IMPORTANT</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', textAlign: 'left', margin: 0, fontStyle: 'italic' }}>
                                  "This is an AI-assisted screening result. It is NOT a medical diagnosis."
                                </p>

                                <hr style={{ border: 'none', borderTop: '1px solid #F1ECE3', margin: '1.5rem 0' }} />

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                  <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', background: 'var(--primary-teal)', color: '#FFF' }} onClick={() => setShowDoctorModal(true)}>
                                    ðŸ”� Find Professional Doctors
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', background: 'var(--accent-coral)', color: '#FFF' }} onClick={() => setShareWithDoctorOpen(true)}>
                                    <Share2 size={14} style={{ marginRight: '4px' }} /> Share with Doctor
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => setTab('assistant')}>
                                    <Send size={14} style={{ marginRight: '4px' }} /> Ask Lens AI
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setShowIndividualDetails(!showIndividualDetails)}>
                                    <Database size={14} style={{ marginRight: '4px' }} /> View Full Analysis
                                  </button>
                                  <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }} onClick={() => setTab('doctoreport')}>
                                    ðŸ“„ Create Doctor Summary
                                  </button>
                                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => setShareModalOpen(true)}>
                                    ðŸ“¤ Share Result
                                  </button>
                                </div>
                              </div>

                              {/* 2. PERSONALIZED EXPLANATION PANEL */}
                              <div className="glass-card" style={{ background: '#FFF', border: '1px solid rgba(15,76,92,0.1)', padding: '1.5rem', marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--primary-teal)', marginBottom: '1rem' }}>Why did I receive this result?</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                                  <div>
                                    <strong>1. What the images showed:</strong>
                                    <p style={{ color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                      {isApiMode && apiResult
                                        ? apiResult.explanation
                                        : (selectedCaseId === 'case-01' 
                                          ? "The AI found visual patterns that influenced its screening result. Images showed a stable, symmetric pigment deposit with smooth boundaries, matching benign freckle classifications."
                                          : currentCase.explanation)
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <strong>2. How consistent the AI findings were:</strong>
                                    <p style={{ color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                      {isApiMode && apiResult ? apiResult.consistency_summary : currentCase.consistency.summaryMessage}
                                    </p>
                                  </div>
                                  <div>
                                    <strong>3. Previous/Current comparison notes:</strong>
                                    <p style={{ color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                      {isApiMode && apiResult ? apiResult.possible_change : currentCase.compare.explanation}
                                    </p>
                                  </div>
                                  <div>
                                    <strong>4. What the model confidence means:</strong>
                                    <p style={{ color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                      Model confidence represents the AI's classification alignment among reference datasets. It describes the visual matches, NOT the mathematical probability that you have cancer.
                                    </p>
                                  </div>
                                  <div>
                                    <strong>5. What the result does NOT mean:</strong>
                                    <p style={{ color: 'var(--accent-coral)', fontWeight: 'bold', marginTop: '0.25rem' }}>
                                      This screening result does not confirm or rule out cancer or any medical condition.
                                    </p>
                                  </div>
                                  <div>
                                    <strong>6. What you can do next:</strong>
                                    <p style={{ color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                      {isApiMode && apiResult
                                        ? apiResult.recommendedAction
                                        : (selectedCaseId === 'case-01'
                                          ? "Continue routine monitoring and protect skin from excess UV exposure."
                                          : "Arrange professional medical evaluation. Share the doctor summary PDF.")
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* 3. TECHNICAL DETAILS COLLAPSIBLE PANEL */}
                              <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', padding: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>Technical Pipeline Parameters</span>
                                  <button 
                                    className="btn btn-secondary" 
                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                    onClick={() => setIsCompareMode(!isCompareMode)} // Re-using compare state as toggle for technical view
                                  >
                                    {isCompareMode ? "Hide Details" : "Show Technical Details"}
                                  </button>
                                </div>

                                {isCompareMode && (
                              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div><strong>CNN Classifier:</strong> TensorFlow MobileNetV2 architecture optimization configured with 224x224 inputs</div>
                                <div><strong>Confidence Metrics:</strong> Softmax probability vectors mapped across dermatological diagnostic nodes</div>
                                <div><strong>Feature Analysis:</strong> Spatial matrix processing for boundary irregularity indices and RGB pigment dispersion</div>
                                <div><strong>Image Quality Checks:</strong> OpenCV Laplacian variance blur estimation, brightness thresholding, and contrast margins</div>
                                <div><strong>RAG Citation Engine:</strong> Dense passage retriever targeting AAD and clinical cancer literature databases</div>
                              </div>
                            )}
                          </div>

                          {/* 4. SUPPORTIVE WELLNESS (AYURVEDIC INFO) */}
                          <div className="glass-card" style={{ background: '#FFF', border: '1px solid rgba(15,76,92,0.12)', padding: '1.75rem', marginBottom: '2rem' }}>
                            <h4 style={{ color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <HeartPulse size={18} style={{ color: 'var(--accent-coral)' }} />
                              Supportive Wellness
                            </h4>
                            
                            {/* Critical safety disclaimer */}
                            <div style={{ background: 'rgba(231,111,81,0.05)', color: 'var(--accent-coral)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', margin: '0.75rem 0 1.25rem', borderLeft: '3.5px solid var(--accent-coral)', fontWeight: '500' }}>
                              "Traditional wellness information may be provided for general wellbeing, but it is not a treatment for skin cancer and should not replace professional medical care."
                            </div>

                            {/* Result Dependent display message */}
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--primary-teal)' }}>
                              {selectedCaseId === 'case-01' 
                                ? "Focus on routine skin monitoring and healthy skin-care habits."
                                : selectedCaseId === 'case-02'
                                ? "Prioritize professional evaluation. Supportive wellness information is secondary and should not delay medical assessment."
                                : "Prioritize prompt professional medical evaluation. Do not use home remedies or Ayurvedic products as a substitute for medical assessment or treatment."
                              }
                            </div>

                            {/* Educational habits info */}
                            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-dark)' }}>
                              <div>â€¢ <strong>Nutrition:</strong> Focus on antioxidant-rich foods (berries, citrus, green leafy vegetables) to support overall cellular skin health.</div>
                              <div>â€¢ <strong>Hydration:</strong> Maintain healthy daily hydration (8-10 glasses) to support optimal skin barrier function.</div>
                              <div>â€¢ <strong>Sun Protection:</strong> Apply broad-spectrum mineral barriers and limit outdoor activity during peak UV indexes (10 AM - 4 PM).</div>
                              <div>â€¢ <strong>Stress Management:</strong> Practice simple meditation, yoga, or breathing exercises to support systemic wellbeing.</div>
                            </div>

                            {/* Safety discussion guidelines */}
                            <div style={{ borderTop: '1px solid #F1ECE3', paddingTop: '0.75rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-gray)', fontStyle: 'italic' }}>
                              "Before using Ayurvedic herbs, oils, supplements or other products, discuss them with a qualified healthcare professional, especially if you are receiving cancer treatment or taking medicines. Natural does not automatically mean safe."
                            </div>
                          </div>

                        </div>

                        {/* Right Results Dashboard Side */}
                        <div>
                          {/* Image Grid with Active zoom/rotate viewer */}
                          <div className="glass-card" style={{ padding: '1rem', background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>VIEW ALL IMAGES</span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                              {uploadedImages.map(img => (
                                <div 
                                  key={img.id} 
                                  style={{ width: '100%', height: '55px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', border: activeViewerImg === img.src ? '2px solid var(--accent-coral)' : '1px solid rgba(0,0,0,0.1)' }}
                                  onClick={() => { setActiveViewerImg(img.src); setZoomScale(1); setRotateDeg(0); }}
                                >
                                  <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                              ))}
                            </div>

                            <div style={{ marginTop: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#FFF', position: 'relative', height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img 
                                src={activeViewerImg || uploadedImages[0]?.src} 
                                alt="" 
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: `scale(${zoomScale}) rotate(${rotateDeg}deg)`, transition: 'transform 0.2s ease' }} 
                              />
                              <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.4rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => setZoomScale(z => z === 1.5 ? 1 : 1.5)}>
                                  <ZoomIn size={12} /> Zoom
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }} onClick={() => setRotateDeg(r => r + 90)}>
                                  <RotateCw size={12} /> Rotate
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* VIEW INDIVIDUAL ANALYSIS ACCORDION */}
                          <div className="glass-card" style={{ padding: '1rem', background: '#FFF', border: '1px solid rgba(15,76,92,0.1)', marginBottom: '1.5rem' }}>
                            <div 
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                              onClick={() => setShowIndividualDetails(!showIndividualDetails)}
                            >
                              <strong style={{ fontSize: '0.9rem', color: 'var(--primary-teal)' }}>View Individual Analysis</strong>
                              {showIndividualDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                            
                            {showIndividualDetails && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #F1ECE3', paddingTop: '1rem' }}>
                                {uploadedImages.map((img, i) => {
                                  const feat = currentCase.features[i] || { shape: "Analyzed", border: "Analyzed", color: "Analyzed", texture: "Analyzed" };
                                  return (
                                    <div key={img.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '0.75rem' }}>
                                      <img src={img.src} alt="" style={{ width: '45px', height: '45px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.08)' }} />
                                      <div>
                                        <strong>IMAGE {img.num}</strong>
                                        <div style={{ color: 'var(--text-gray)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                                          â€¢ Shape: {feat.shape}<br />
                                          â€¢ Border: {feat.border}<br />
                                          â€¢ Color: {feat.color}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-gray)', marginTop: '0.25rem' }}>
                                  <strong>Combined interpretation:</strong> Individual image features aggregate to outline border scalloping and asymmetry variations.
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CANCER TYPE EDUCATION BLOCK */}
                          <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>AI SCREENING CLASS</span>
                            <h4 style={{ color: 'var(--primary-teal)', margin: '0.25rem 0' }}>{selectedCaseId === 'case-01' ? 'Stable Benign Freckle' : 'Melanoma class'}</h4>
                            
                            <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                              <strong>What is melanoma?</strong>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                                Melanoma develops from melanocytes, the cells that produce pigment. It can be more serious because it may spread to other parts of the body.
                              </p>
                              
                              <strong style={{ display: 'block', marginTop: '0.75rem' }}>Why did the model produce this class?</strong>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                                The vision model flagged scalloped margins and two shades of brown, which resemble atypical melanoma hallmarks.
                              </p>

                              <p style={{ color: 'var(--accent-coral)', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.75rem', margin: 0 }}>
                                * An AI screening classification cannot confirm melanoma.
                              </p>
                            </div>
                          </div>

                          {/* RAG CITATION REFERENCES */}
                          <div className="glass-card" style={{ padding: '1rem', background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.1)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>INFORMATION USED FOR THIS EXPLANATION</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                              {ragQA.slice(0, 3).map((r, idx) => (
                                <div key={idx} style={{ padding: '0.5rem', background: '#FFF', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.04)' }}>
                                  <strong>{r.sources[0]?.title || "Clinical Manual"}</strong>
                                  <div style={{ color: 'var(--text-gray)', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                                    Source: {r.sources[0]?.author || "Dermatology Board Review"} ({r.sources[0]?.year || "2024"})
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

          {/* TAB: MY HISTORY */}
          {activeTab === 'history' && (
            <MyHistory 
              setTab={setTab}
              setSessionId={setSessionId}
              setUploadedImages={setUploadedImages}
              setApiResult={setApiResult}
              setScreeningState={setScreeningState}
              setIsApiMode={setIsApiMode}
            />
          )}

          {/* TAB: SKIN STORY TIMELINE */}
          {activeTab === 'story' && (
            <div>
              <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2>Your Skin Story Timeline</h2>
                <p style={{ color: 'var(--text-gray)' }}>Chronological record of observations. Click an observation to view all uploaded views.</p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', background: 'var(--bg-warm-ivory)', padding: '1.25rem 2rem', borderRadius: 'var(--border-radius-lg)', marginBottom: '2.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-coral)' }}>{currentCase.timeline.length}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>events logged</p>
                </div>
                <div style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{currentCase.daysTracked}</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>days tracked</p>
                </div>
                <div style={{ borderRight: '1px solid rgba(0,0,0,0.06)' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--secondary-forest)' }}>1</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>location</p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '11px', width: '2px', background: 'var(--primary-teal)' }}></div>

                {currentCase.timeline.map((item, index) => (
                  <div key={index} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                    <div style={{ position: 'absolute', left: '-30px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-coral)', border: '2px solid #FFF' }}></div>
                    
                    <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: 'var(--primary-teal)', fontSize: '1.15rem' }}>{item.date}</span>
                          <span style={{ marginLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-gray)' }}>Location: {item.location}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent-coral)', background: 'rgba(231,111,81,0.06)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                          {item.risk}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{item.note}</p>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {uploadedImages.map((img) => (
                          <div key={img.id} style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: COMPARE CHANGES */}
          {activeTab === 'compare' && (
            <div>
              <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2>Compare Your Skin Story</h2>
                <p style={{ color: 'var(--text-gray)' }}>Automatically view and slider-compare previous and current observations side-by-side.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
                <div>
                  <div style={{ background: 'var(--bg-warm-ivory)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(15,76,92,0.08)', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>Visual Change Indicator</span>
                    <h3 style={{ color: 'var(--primary-teal)', margin: '0.25rem 0' }}>{currentCase.compare.changeLevel} CHANGE</h3>
                    <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', fontWeight: '500' }}>{currentCase.compare.explanation}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', marginTop: '0.4rem', margin: 0 }}>
                      * This indicator describes image differences. It does not determine whether the change is medically significant.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    <strong>Select Images for Slider:</strong>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)' }}>PREVIOUS IMAGE</span>
                        <select value={compareLeft} onChange={(e) => setCompareLeft(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px' }}>
                          {uploadedImages.map(img => <option key={img.id} value={img.src}>Image #{img.num} ({img.type})</option>)}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)' }}>CURRENT IMAGE</span>
                        <select value={compareRight} onChange={(e) => setCompareRight(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px' }}>
                          {uploadedImages.map(img => <option key={img.id} value={img.src}>Image #{img.num} ({img.type})</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(231,111,81,0.05)', color: 'var(--accent-coral)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.8rem', borderLeft: '3px solid var(--accent-coral)' }}>
                    <strong>Clinical Notice:</strong> Image differences may reflect actual change or differences in photography conditions (lighting, camera distance, angle). Consult a dermatologist for concerning findings.
                  </div>
                </div>

                {/* Slider layout */}
                <div>
                  <div className="comparison-slider-container">
                    <div 
                      className="comparison-image" 
                      style={{ backgroundImage: `url(${compareRight})` }}
                    />
                    <div 
                      className="comparison-image" 
                      style={{ 
                        backgroundImage: `url(${compareLeft})`,
                        width: `${sliderVal}%`,
                        borderRight: '2px solid #FFF'
                      }}
                    />
                    <div 
                      className="comparison-slider-handle"
                      style={{ left: `${sliderVal}%` }}
                    >
                      <div className="comparison-slider-button">â†”</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sliderVal} 
                      onChange={(e) => setSliderVal(Number(e.target.value))}
                      style={{ width: '80%', accentColor: 'var(--primary-teal)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === 'assistant' && (
            <div>
              <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2>Chat With LENS</h2>
                <p style={{ color: 'var(--text-gray)' }}>Your RAG-backed medical skin-health companion.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                
                {/* Chat window */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '480px', border: '1px solid var(--border-teal-glass)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden' }}>
                  <div className="chat-messages" style={{ flex: 1, padding: '1rem 1.5rem' }}>
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`chat-bubble ${msg.sender}`}>
                        <div>{msg.text}</div>
                        {msg.sources && (
                          <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)' }}>
                            <strong>Sources:</strong> {msg.sources.map(s => `${s.title} (${s.author})`).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-teal)', opacity: 0.3 }} />
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-teal)', opacity: 0.6 }} />
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-teal)' }} />
                      </div>
                    )}
                  </div>

                  {/* Suggestion list */}
                  <div className="chat-suggestions" style={{ background: 'var(--bg-warm-ivory)', borderTop: '1px solid #F1ECE3' }}>
                    {ragQA.slice(0, 4).map((qa, i) => (
                      <button
                        key={i}
                        className="chat-suggestion-chip"
                        onClick={() => triggerRAGResponse(qa.question, qa.answer, qa.sources)}
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleChatSend} className="chat-input-area" style={{ background: '#FFF', display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem' }}>
                    <button 
                      type="button" 
                      onClick={startSpeechRecognition}
                      className={`btn ${isListeningMic ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: isListeningMic ? 'var(--accent-coral)' : '#FFF', color: isListeningMic ? '#FFF' : 'var(--primary-teal)', minWidth: 'auto' }}
                      title="Ask Lens AI by Voice"
                    >
                      {isListeningMic ? "ðŸ›‘" : "ðŸŽ¤"}
                    </button>
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      placeholder={isListeningMic ? "Listening..." : "Ask LENS a question..."} 
                      className="chat-input" 
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', height: '40px' }}>
                      <Send size={16} />
                    </button>
                  </form>
                </div>

                {/* RAG pipeline */}
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>RAG FLOW STATUS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                    {[
                      { step: 1, label: "Question Entered", desc: "User inputs a query into the chat thread." },
                      { step: 2, label: "Semantic Search / Retrieval", desc: "Search trusted clinical sources." },
                      { step: 3, label: "Context Structuring", desc: "Bundle the retrieved excerpts with results." },
                      { step: 4, label: "IBM Granite translation", desc: "Render natural language safely." }
                    ].map((step) => {
                      const isActive = ragPipelineStep === step.step;
                      const isComplete = ragPipelineStep > step.step;
                      return (
                        <div 
                          key={step.step} 
                          className="glass-card" 
                          style={{ 
                            padding: '0.75rem 1rem', 
                            background: isActive ? 'var(--primary-teal)' : '#FFF',
                            color: isActive ? '#FFF' : 'var(--text-dark)',
                            border: isActive ? 'none' : 'var(--border-teal-glass)',
                            opacity: isComplete ? 0.6 : 1,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <strong style={{ fontSize: '0.85rem' }}>{step.step}. {step.label}</strong>
                          <p style={{ fontSize: '0.75rem', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--text-gray)', marginTop: '0.25rem' }}>{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: DOCTOR REPORT SUMMARY */}
          {activeTab === 'doctoreport' && (
            <div>
              <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2>DERMALENS AI - MULTI-IMAGE SCREENING SUMMARY</h2>
                  <p style={{ color: 'var(--text-gray)' }}>A doctor-ready overview of observations and visual change history.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-secondary" onClick={() => window.print()}>
                    <Printer size={16} /> Generate PDF
                  </button>
                  <button className="btn btn-primary" onClick={() => alert('Summary shared with dermatologist!')}>
                    <Share2 size={16} /> Share with Doctor
                  </button>
                </div>
              </div>

              {/* Printable PDF Box */}
              <div className="glass-card" style={{ background: 'var(--bg-warm-ivory)', border: '1px solid rgba(15,76,92,0.12)', padding: '2.5rem' }} id="print-area">
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2.5px solid var(--primary-teal)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary-teal)', margin: 0 }}>DERMALENS AI SUMMARY REPORT</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>AI-assisted Screening and Education Support Platform</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <div><strong>Patient Name:</strong> {patientName || `DL-CASE-MEMBER-${(selectedCaseId).toUpperCase()}`}</div>
                    <div><strong>Date Generated:</strong> {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>

                {/* Grid of ALL analyzed images */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary-teal)', marginBottom: '1rem' }}>ANALYZED MULTI-VIEW IMAGES ({uploadedImages.length} views)</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {uploadedImages.map(img => (
                      <div key={img.id} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '4px', background: '#FFF', padding: '0.5rem', width: '130px', textAlign: 'center' }}>
                        <img src={img.src} alt="" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '0.25rem' }}>IMAGE {img.num}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-gray)' }}>{img.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong>Body Location:</strong> {isApiMode && apiResult ? apiResult.classification : currentCase.location}
                  </div>
                  <div>
                    <strong>AI Consistency Rating:</strong> {isApiMode && apiResult ? apiResult.ai_consistency : currentCase.consistency.status} ({isApiMode && apiResult ? apiResult.consistency_summary : currentCase.consistency.summary})
                  </div>
                </div>

                {/* Result Info */}
                <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(15,76,92,0.08)', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>COMBINED AI SCREENING RESULT</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '2rem', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--accent-coral)' }}>
                        {isApiMode && apiResult
                          ? getTranslatedRiskLabel(apiResult.overallResult, voiceLang)
                          : getTranslatedRiskLabel(selectedCaseId === 'case-01' ? 'LOW' : selectedCaseId === 'case-02' ? 'MODERATE' : selectedCaseId === 'case-03' ? 'UNCERTAIN' : 'HIGH', voiceLang)
                        }
                      </strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginTop: '0.4rem' }}>{isApiMode && apiResult ? apiResult.explanation : currentCase.riskDescription}</p>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-gray)', fontWeight: 'bold' }}>CONFIDENCE</span>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>{isApiMode && apiResult ? apiResult.confidence : currentCase.confidence}</h3>
                    </div>
                  </div>
                </div>

                {/* Consistency matrix summary */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>CROSS-IMAGE ANALYSIS REPORT</h4>
                  <p style={{ fontSize: '0.85rem' }}>{isApiMode && apiResult ? apiResult.consistency_summary : currentCase.consistency.summaryMessage}</p>
                </div>

                {/* Attributes list */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.75rem' }}>VISUAL ATTRIBUTE ANALYSIS</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <tbody>
                      {Object.entries(isApiMode && apiResult ? apiResult.visual_features : (currentCase.visualFeatures || {})).map(([k, v]) => (
                        <tr key={k} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                          <td style={{ padding: '0.6rem 0', fontWeight: 'bold', width: '120px', textTransform: 'capitalize' }}>{k}</td>
                          <td style={{ padding: '0.6rem 0' }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Supportive Wellness Print Section */}
                <div style={{ margin: '2rem 0', borderTop: '1px dashed rgba(15,76,92,0.15)', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
                  <h4 style={{ color: 'var(--primary-teal)', marginBottom: '0.5rem' }}>SUPPORTIVE WELLNESS</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', margin: 0 }}>
                    Traditional wellness information may be provided for general wellbeing, but it is not a treatment for skin cancer and should not replace professional medical care. Natural does not automatically mean safe.
                  </p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-teal)', marginTop: '0.5rem', margin: 0 }}>
                    Wellness Guideline: {
                      isApiMode && apiResult 
                        ? apiResult.recommendedAction
                        : (selectedCaseId === 'case-01' 
                          ? "Focus on routine skin monitoring and healthy skin-care habits."
                          : selectedCaseId === 'case-02'
                          ? "Prioritize professional evaluation. Supportive wellness information is secondary and should not delay medical assessment."
                          : selectedCaseId === 'case-03'
                          ? "Improve image quality or seek professional evaluation if concerned."
                          : "Prioritize prompt professional medical evaluation. Do not use home remedies or Ayurvedic products as a substitute for medical assessment or treatment.")
                    }
                  </p>
                </div>

                {/* Footer Disclaimers */}
                <div style={{ borderTop: '1.5px solid var(--primary-teal)', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                  <strong style={{ color: 'var(--accent-coral)' }}>WHAT TO DO NEXT:</strong>
                  <p style={{ marginTop: '0.25rem', lineHeight: '1.4' }}>{isApiMode && apiResult ? apiResult.recommendedAction : currentCase.nextStep}</p>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--text-gray)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem', borderRadius: '4px', background: '#FFF' }}>
                    <strong>Safety Disclaimer:</strong> This clinical report sheet is compiled for educational screening support using computer vision classification (MobileNet) and retrieved references (RAG / IBM Granite). It is not a medical diagnosis. Only a licensed physician can perform biopsy, review pathological margins, and diagnose skin conditions.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: DATASET STATISTICS */}
          {activeTab === 'dataset' && (
            <div>
              <div style={{ borderBottom: '1px solid #F1ECE3', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <h2>DATASET OVERVIEW</h2>
                <p style={{ color: 'var(--text-gray)' }}>Actual database and organized dataset distribution statistics.</p>
              </div>

              {loadingStats ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-gray)' }}>
                  <RefreshCw size={24} className="spin" style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 2s linear infinite' }} />
                  <span>Loading dataset statistics...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Disease Class Overview Card */}
                  <div className="glass-card" style={{ padding: '2rem', background: '#FFF', border: '1px solid rgba(15,76,92,0.12)' }}>
                    <h3 style={{ color: 'var(--primary-teal)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>Disease/Class Distribution</h3>
                    {Object.keys(datasetStats.disease_overview || {}).length === 0 ? (
                      <p style={{ color: 'var(--text-gray)', fontStyle: 'italic' }}>No dataset records organized yet. Complete a screening to see statistics.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--primary-teal)' }}>
                            <th style={{ padding: '0.75rem 0', color: 'var(--primary-teal)' }}>Disease/Class</th>
                            <th style={{ padding: '0.75rem 0', color: 'var(--primary-teal)', textAlign: 'right' }}>Images Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(datasetStats.disease_overview).map(([disease, count]) => (
                            <tr key={disease} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>{disease}</td>
                              <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Image Views Distribution Card */}
                  <div className="glass-card" style={{ padding: '2rem', background: '#FFF', border: '1px solid rgba(15,76,92,0.12)' }}>
                    <h3 style={{ color: 'var(--primary-teal)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>Image Views Distribution</h3>
                    {Object.keys(datasetStats.image_views || {}).length === 0 ? (
                      <p style={{ color: 'var(--text-gray)', fontStyle: 'italic' }}>No image view statistics available.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--primary-teal)' }}>
                            <th style={{ padding: '0.75rem 0', color: 'var(--primary-teal)' }}>Image View/Angle</th>
                            <th style={{ padding: '0.75rem 0', color: 'var(--primary-teal)', textAlign: 'right' }}>Images Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(datasetStats.image_views).map(([view, count]) => (
                            <tr key={view} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                              <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>{view}</td>
                              <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-teal)' }}>{count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* WHATSAPP PRIVACY CONFIRMATION MODAL */}
      {shareWithDoctorOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,47,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000 }}>
          <div className="glass-card" style={{ background: 'var(--dark-navy)', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', maxWidth: '480px', width: '90%', padding: '2rem', position: 'relative', borderRadius: '12px' }}>
            <button 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              onClick={() => setShareWithDoctorOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              Review before sharing
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Your screening information will be shared through WhatsApp. Please make sure you are sending it to the intended healthcare professional.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} 
                onClick={() => setShareWithDoctorOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'var(--accent-coral)' }} 
                onClick={handleContinueToWhatsApp}
              >
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA SIMULATOR MODAL OVERLAY */}
      {showCameraModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,47,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-card" style={{ background: 'var(--dark-navy)', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '480px', width: '90%', padding: '2rem', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              onClick={() => setShowCameraModal(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Camera style={{ color: 'var(--accent-coral)' }} />
              Dermal Camera Viewfinder
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
              Teledermatology alignment helper. Place the skin spot within the center reticle.
            </p>

            <div style={{ position: 'relative', width: '100%', height: '240px', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
              {cameraPermissionDenied ? (
                <div style={{ padding: '2rem', textAlign: 'center', zIndex: 2 }}>
                  <p style={{ color: 'var(--accent-coral)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Camera permission is required to take a photo.
                  </p>
                  <button className="btn btn-primary" onClick={startCamera}>Try Again</button>
                </div>
              ) : cameraInitError ? (
                <div style={{ padding: '2rem', textAlign: 'center', zIndex: 2 }}>
                  <p style={{ color: 'var(--accent-coral)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {cameraInitError}
                  </p>
                  <button className="btn btn-primary" onClick={startCamera}>Try Again</button>
                </div>
              ) : (
                <>
                  {!isCameraActive && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'absolute', inset: 0, justifyContent: 'center', background: '#000', zIndex: 1 }}>
                      <div className="animate-spin" style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%' }} />
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Starting camera...</p>
                    </div>
                  )}
                  <video 
                    ref={videoRefCallback} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCameraActive ? 'block' : 'none' }} 
                  />
                  {/* Alignment reticle overlay */}
                  <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '2.5px dashed var(--accent-aqua)', position: 'absolute', animation: 'pulse 2s infinite', pointerEvents: 'none', display: isCameraActive ? 'block' : 'none' }} />
                  <div style={{ position: 'absolute', width: '20px', height: '2px', background: 'var(--accent-coral)', pointerEvents: 'none', display: isCameraActive ? 'block' : 'none' }} />
                  <div style={{ position: 'absolute', width: '2px', height: '20px', background: 'var(--accent-coral)', pointerEvents: 'none', display: isCameraActive ? 'block' : 'none' }} />
                  
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', position: 'absolute', bottom: '15px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', pointerEvents: 'none', display: isCameraActive ? 'block' : 'none' }}>
                    FOCAL LENGTH: AUTO LOCK <Check size={14} style={{ verticalAlign: 'middle' }} />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-glass" onClick={() => setShowCameraModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-accent" 
                onClick={handleCameraCapture}
                disabled={!isCameraActive}
                style={{ opacity: isCameraActive ? 1 : 0.5, cursor: isCameraActive ? 'pointer' : 'not-allowed' }}
              >
                Capture Spot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO RESULT EXPLANATION MODAL */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,47,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-card" style={{ background: '#12253a', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)', maxWidth: '680px', width: '90%', padding: '1.5rem', position: 'relative', borderRadius: '12px' }}>
            <button 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              onClick={() => {
                setShowVideoModal(false);
                setVideoPlaying(false);
                stopSpeaking();
              }}
            >
              <X size={22} />
            </button>

            <h3 style={{ color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.15rem' }}>
              <Video size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Visual Result Explanation â€” Scene {videoCurrentScene} of 7
            </h3>

            <div style={{ position: 'relative', width: '100%', height: '320px', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
              
              {videoPreparing ? (
                <div style={{ textAlign: 'center', color: '#FFF', padding: '2rem' }}>
                  <RefreshCw size={36} className="spin" style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 2s linear infinite' }} />
                  <p style={{ fontSize: '1rem', color: '#EAEAEA' }}>Preparing video in {voiceLang}...</p>
                </div>
              ) : (
                <>
              {/* Scene 1: AI Indication Level */}
              {videoCurrentScene === 1 && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="pulse-coral-ring" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(231,111,81,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Shield size={36} style={{ color: 'var(--accent-coral)' }} />
                  </div>
                  <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>AI SCREENING INDICATION</h4>
                  <h2 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0.5rem 0 0', fontWeight: '800' }}>
                    {isApiMode && apiResult
                      ? getTranslatedRiskLabel(apiResult.overallResult, voiceLang)
                      : getTranslatedRiskLabel(selectedCaseId === 'case-01' ? 'LOW' : selectedCaseId === 'case-02' ? 'MODERATE' : selectedCaseId === 'case-03' ? 'UNCERTAIN' : 'HIGH', voiceLang)
                    }
                  </h2>
                </div>
              )}

              {/* Scene 2: Thumbnail Gallery */}
              {videoCurrentScene === 2 && (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem' }}>ANALYZED OBSERVATION VIEWS</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {uploadedImages.map(img => (
                      <div key={img.id} style={{ border: '2px solid var(--primary-teal)', borderRadius: '6px', background: '#222', padding: '0.25rem' }}>
                        <img src={img.src} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                        <div style={{ fontSize: '0.6rem', color: '#AAA', marginTop: '0.2rem' }}>IMG {img.num}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 3: Highlighted Features */}
              {videoCurrentScene === 3 && (
                <div style={{ padding: '1.5rem', width: '80%' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>AI Visual Attributes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
                      <span>Asymmetry:</span> <strong style={{ color: 'var(--accent-aqua)' }}>{getSymmetryStatus()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
                      <span>Border Scalloping:</span> <strong style={{ color: 'var(--accent-aqua)' }}>{getBorderStatus()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem' }}>
                      <span>Color Variation:</span> <strong style={{ color: 'var(--accent-aqua)' }}>{getColorStatus()}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene 4: Patient-Friendly Explanation */}
              {videoCurrentScene === 4 && (
                <div style={{ padding: '1.5rem', textAlign: 'center', width: '85%' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>WHAT THE AI DETECTED</h4>
                  <p style={{ fontSize: '0.85rem', color: '#EAEAEA', lineHeight: '1.5', margin: 0, maxHeight: '180px', overflowY: 'auto' }}>
                    {isApiMode && apiResult
                      ? apiResult.explanation
                      : (selectedCaseId === 'case-01'
                        ? "A stable and uniform pigment pattern with smooth, regular edges, representing benign features."
                        : "Some localized color differences and uneven borders that influence the screening recommendation."
                      )
                    }
                  </p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-aqua)' }}>
                    Model Confidence Score: {isApiMode && apiResult ? apiResult.confidence : currentCase.confidence}
                  </div>
                </div>
              )}

              {/* Scene 5: Important Safety Warning */}
              {videoCurrentScene === 5 && (
                <div style={{ padding: '2rem', textAlign: 'center', width: '85%' }}>
                  <div style={{ color: 'var(--accent-coral)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <AlertTriangle size={32} />
                  </div>
                  <h4 style={{ color: 'var(--accent-coral)', fontSize: '0.9rem', margin: 0, fontWeight: 'bold' }}>IMPORTANT SAFETY INFORMATION</h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginTop: '0.5rem' }}>
                    "{getTranslatedDisclaimer(voiceLang)}"
                  </p>
                </div>
              )}

              {/* Scene 6: Action Steps */}
              {videoCurrentScene === 6 && (
                <div style={{ padding: '1.5rem', width: '85%' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', textAlign: 'center' }}>RECOMMENDED NEXT STEPS</h4>
                  <ul style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#EAEAEA', paddingLeft: '1rem', textAlign: 'left' }}>
                    {isApiMode && apiResult && apiResult.recommendedAction ? (
                      <li>{apiResult.recommendedAction}</li>
                    ) : (
                      getTranslatedNextSteps(voiceLang).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* Scene 7: End Summary */}
              {videoCurrentScene === 7 && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <CheckCircle2 size={36} style={{ color: 'var(--secondary-forest)', marginBottom: '0.5rem', display: 'inline-block' }} />
                  <h4 style={{ color: '#FFF', fontSize: '1rem', margin: 0 }}>
                    {getTranslatedScene7(voiceLang).title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
                    {getTranslatedScene7(voiceLang).desc}
                  </p>
                </div>
              )}

                </>
              )}
              {/* High Contrast Subtitles Bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.85)', padding: '0.8rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: '500' }}>
                  {videoVoiceUnavailable ? (
                    <span style={{ color: 'var(--accent-coral)' }}><AlertTriangle size={14} />ï¸� Video narration is not currently available in this language.</span>
                  ) : (
                    getVideoSceneScripts(
                      selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : selectedCaseId === 'case-03' ? 'uncertain' : 'high',
                      voiceLang
                    )
                  )}
                </span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-glass" 
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}
                  onClick={() => setVideoPlaying(!videoPlaying)}
                >
                  {videoPlaying ? "â�¸ Pause" : "â–¶ Play"}
                </button>
                <button 
                  className="btn btn-glass" 
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}
                  onClick={() => {
                    setVideoCurrentScene(1);
                    setVideoPlaying(true);
                  }}
                >
                  ðŸ”„ Replay
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3,4,5,6,7].map(s => (
                    <div 
                      key={s} 
                      style={{ width: '8px', height: '8px', borderRadius: '50%', background: videoCurrentScene === s ? 'var(--accent-coral)' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                      onClick={() => {
                        setVideoCurrentScene(s);
                        setVideoPlaying(true);
                      }}
                    />
                  ))}
                </div>

                <button 
                  className="btn btn-glass" 
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.2)' }}
                  onClick={() => {
                    setVideoMuted(!videoMuted);
                    if (videoPlaying) {
                      window.speechSynthesis.cancel();
                      const sceneText = getVideoSceneScripts(
                        selectedCaseId === 'case-01' ? 'low' : selectedCaseId === 'case-02' ? 'moderate' : selectedCaseId === 'case-03' ? 'uncertain' : 'high',
                        voiceLang
                      );
                      playSpeaking(sceneText, voiceLang);
                    }
                  }}
                >
                  {videoMuted ? "ðŸ”‡ Muted" : "ðŸ”Š Sound"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAREGIVER SHARE PORTAL MODAL */}
      {shareModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,47,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-card" style={{ background: '#FFF', color: 'var(--text-dark)', maxWidth: '460px', width: '90%', padding: '2rem', position: 'relative', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}>
            <button 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer' }}
              onClick={() => setShareModalOpen(false)}
            >
              <X size={20} />
            </button>

            <h3 style={{ color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              ðŸ“¤ Share with Caregiver
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '1.5rem' }}>
              Send a secure observation summary link to a caregiver or family member.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Caregiver Name</label>
                <input type="text" placeholder="e.g. Spouse / Doctor" style={{ width: '100%', padding: '0.4rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Caregiver Email</label>
                <input type="email" placeholder="caregiver@example.com" style={{ width: '100%', padding: '0.4rem', border: '1px solid rgba(15,76,92,0.2)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Observation Link</label>
                <input type="text" readOnly value={`https://dermalens.ai/share/session-78x99-${selectedCaseId}`} style={{ width: '100%', padding: '0.4rem', border: '1px solid rgba(15,76,92,0.15)', borderRadius: '4px', background: '#F8F9FA', fontSize: '0.75rem', color: 'var(--text-gray)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShareModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => { alert('Observations shared with caregiver!'); setShareModalOpen(false); }}>
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 24. DOCTOR LOCATOR MODAL */}
      {showDoctorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .user-map-pin, .doctor-map-pin {
              font-size: 24px;
              text-align: center;
              line-height: 24px;
              cursor: pointer;
              transition: transform 0.15s ease;
            }
            .user-map-pin:hover, .doctor-map-pin:hover {
              transform: scale(1.25);
            }
            .leaflet-popup-content-wrapper {
              border-radius: 8px;
              font-family: sans-serif;
              font-size: 0.8rem;
              color: var(--text-dark);
              box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }
            .doctor-map-container {
              width: 100%;
              height: 500px;
              position: relative;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              border: 1px solid rgba(15,76,92,0.1);
              margin-bottom: 2rem;
            }
            @media (min-width: 1200px) {
              .doctor-map-container {
                height: 600px;
              }
            }
            @media (min-width: 1600px) {
              .doctor-map-container {
                height: 680px;
              }
            }
            @media (max-width: 768px) {
              .doctor-map-container {
                height: 420px !important;
                margin-bottom: 1.5rem;
              }
              .doctor-list-cards-grid {
                grid-template-columns: 1fr !important;
              }
            }
          ` }} />
          <div style={{ width: '100%', maxWidth: '1200px', height: '90vh', background: '#FAF9F6', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(15,76,92,0.1)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#0F4C5C', color: '#FFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>ðŸ�¥</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFF', fontWeight: 'bold' }}>Recommended Professional Doctors Near You</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{getDoctorDisclaimer()}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDoctorModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                &times;
              </button>
            </div>

            {/* Location request onboarding screen */}
            {locationMethod === null ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '450px', background: '#FFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(15,76,92,0.08)' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>ðŸ“�</span>
                  <h4 style={{ color: 'var(--primary-teal)', fontSize: '1.25rem', marginBottom: '1rem' }}>Find Nearby Dermatologists</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                    Allow location access to find professional doctors near you.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="btn btn-primary" onClick={handleAllowLocation} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                      Allow Location
                    </button>
                    <button className="btn btn-secondary" onClick={() => setLocationMethod('manual')} style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                      Enter Location Manually
                    </button>
                  </div>
                </div>
              </div>
            ) : locationMethod === 'manual' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <div style={{ maxWidth: '450px', background: '#FFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(15,76,92,0.08)', width: '100%' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>ðŸ”�</span>
                  <h4 style={{ color: 'var(--primary-teal)', fontSize: '1.25rem', marginBottom: '1rem' }}>Enter Your Location</h4>
                  <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Enter your city, area, PIN code, or address to search.
                  </p>
                  
                  <form onSubmit={handleManualLocationSubmit}>
                    <input 
                      type="text"
                      placeholder="e.g. Vijayawada, Andhra Pradesh"
                      value={manualLocationInput}
                      onChange={(e) => setManualLocationInput(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid rgba(15,76,92,0.2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}
                      required
                    />
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn btn-secondary" type="button" onClick={() => setLocationMethod(null)} style={{ flex: 1 }}>
                        Back
                      </button>
                      <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
                        Search Doctors
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Doctor finder layout */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1.5rem' }} className="doctor-finder-body">
                
                {/* Search and Filters panel */}
                <div style={{ padding: '1rem', borderRadius: '12px', background: '#FFF', border: '1px solid rgba(15,76,92,0.08)', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Search doctors or clinics..." 
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      style={{ flex: 1, minWidth: '250px', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(15,76,92,0.15)', fontSize: '0.9rem' }}
                    />
                    {(locationMethod === 'manual_complete' || locationMethod === 'manual') && (
                      <button 
                        className="btn btn-secondary" 
                        type="button"
                        onClick={() => setLocationMethod('manual')}
                        style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                      >
                        Change Search Location
                      </button>
                    )}
                  </div>

                  {/* Filters & Sorting Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                    {/* Specialization selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-gray)' }}>Specialist Type</label>
                      <select 
                        value={filterSpec} 
                        onChange={(e) => {
                          setFilterSpec(e.target.value);
                          loadDoctors(userCoords?.lat, userCoords?.lon, manualLocationInput || null);
                        }}
                        style={{ padding: '0.45rem', borderRadius: '6px', border: '1px solid rgba(15,76,92,0.15)', background: '#FFF' }}
                      >
                        <option value="">All Specialists</option>
                        <option value="Dermatologist">Dermatologists Only</option>
                        <option value="Clinic">Clinics Only</option>
                        <option value="Hospital">Hospitals Only</option>
                      </select>
                    </div>

                    {/* Distance filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-gray)' }}>Distance Radius</label>
                      <select 
                        value={filterDistance} 
                        onChange={(e) => {
                          setFilterDistance(parseInt(e.target.value));
                          loadDoctors(userCoords?.lat, userCoords?.lon, manualLocationInput || null);
                        }}
                        style={{ padding: '0.45rem', borderRadius: '6px', border: '1px solid rgba(15,76,92,0.15)', background: '#FFF' }}
                      >
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km</option>
                        <option value="25">Within 25 km</option>
                        <option value="50">Within 50 km</option>
                      </select>
                    </div>

                    {/* Sort selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-gray)' }}>Sort By</label>
                      <select 
                        value={sortMethod} 
                        onChange={(e) => {
                          setSortMethod(e.target.value);
                          loadDoctors(userCoords?.lat, userCoords?.lon, manualLocationInput || null);
                        }}
                        style={{ padding: '0.45rem', borderRadius: '6px', border: '1px solid rgba(15,76,92,0.15)', background: '#FFF' }}
                      >
                        <option value="distance">Nearest</option>
                        <option value="rating">Highest Rated</option>
                        <option value="reviews">Most Reviewed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Doctor Count Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-teal)' }}>
                    {getDoctorCountSummary()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                    *Results matched within select radius
                  </span>
                </div>

                {/* Map Container */}
                <div 
                  className="doctor-map-container"
                  style={mapFullscreen ? {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999999,
                    width: '100vw',
                    height: '100vh',
                    borderRadius: 0,
                    boxShadow: 'none'
                  } : undefined}
                >
                  {/* Map overlay controls */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      type="button" 
                      onClick={handleCenterOnUser} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FFF', border: '1.5px solid rgba(0,0,0,0.15)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', outline: 'none' }}
                      title="Center on My Location"
                    >
                      ðŸ“�
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setMapFullscreen(!mapFullscreen)} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FFF', border: '1.5px solid rgba(0,0,0,0.15)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', outline: 'none', fontWeight: 'bold' }}
                      title={mapFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {mapFullscreen ? "Exit â›¶" : "â›¶"}
                    </button>
                  </div>

                  {/* Loading/Error/Actual Map render states */}
                  {loadingDoctors ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF9F6' }}>
                      <div style={{ width: '40px', height: '40px', border: '4px solid rgba(15,76,92,0.1)', borderTopColor: 'var(--primary-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', marginTop: '1rem', fontWeight: 'bold' }}>Finding professional doctors near you...</span>
                    </div>
                  ) : doctorError ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF9F6', padding: '2rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><AlertTriangle size={14} />ï¸�</span>
                      <strong style={{ color: 'var(--accent-coral)', fontSize: '0.95rem', marginBottom: '1rem' }}>Map could not be loaded.</strong>
                      <button className="btn btn-primary" type="button" onClick={() => loadDoctors(userCoords?.lat, userCoords?.lon, manualLocationInput || null)}>
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div id="doctor-leaflet-map" style={{ width: '100%', height: '100%', minHeight: '100%' }} />
                  )}
                </div>

                {/* Below the Map: Nearby Professional Doctors Section */}
                <h3 style={{ color: 'var(--primary-teal)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold', borderBottom: '2px solid rgba(15,76,92,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ðŸ©º Nearby Professional Doctors
                </h3>

                {/* Doctor List Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem', marginBottom: '1rem' }} className="doctor-list-cards-grid">
                  {doctorList
                    .filter(d => {
                      if (!doctorSearchQuery) return true;
                      const q = doctorSearchQuery.toLowerCase();
                      return d.name.toLowerCase().includes(q) || d.clinic_name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q);
                    })
                    .map(doc => {
                      const isSelected = doc.id === selectedDoctorId;
                      return (
                        <div 
                          key={doc.id}
                          id={`doc-card-${doc.id}`}
                          onClick={() => handleSelectDoctorCard(doc)}
                          style={{ 
                            padding: '1.25rem', 
                            borderRadius: '12px', 
                            background: isSelected ? '#FAF6EE' : '#FFF', 
                            border: isSelected ? '1.5px solid var(--primary-teal)' : '1px solid rgba(15,76,92,0.08)',
                            boxShadow: isSelected ? '0 6px 16px rgba(15,76,92,0.06)' : '0 2px 8px rgba(0,0,0,0.02)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '160px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                              <div>
                                <h4 style={{ margin: 0, color: 'var(--primary-teal)', fontSize: '1rem', fontWeight: 'bold' }}>{doc.name}</h4>
                                <span style={{ fontSize: '0.7rem', color: 'var(--secondary-forest)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{doc.specialization}</span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                                <span style={{ color: 'var(--accent-coral)', fontWeight: 'bold' }}>⭐� {doc.rating}</span>
                                <span style={{ color: 'var(--text-gray)', fontSize: '0.65rem' }}>{doc.review_count} reviews</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>ðŸ�¥</span> {doc.clinic_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)', lineHeight: '1.4' }}>
                              <span>ðŸ“�</span> {doc.address}
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                            <strong style={{ fontSize: '0.8rem', color: 'var(--primary-teal)' }}>{doc.distance_km} km away</strong>
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                className="btn btn-secondary" 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDoctor(doc);
                                }}
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                              >
                                View Details
                              </button>
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords?.lat},${userCoords?.lon}&destination=${doc.latitude},${doc.longitude}`} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                              >
                                ðŸ§­ Directions
                              </a>
                              {doc.phone && (
                                <a 
                                  href={`tel:${doc.phone}`} 
                                  onClick={(e) => e.stopPropagation()}
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}
                                >
                                  ðŸ“ž Call
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 25. NESTED DOCTOR DETAILS MODAL */}
      {selectedDoctor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: '#FFF', borderRadius: '12px', border: '1px solid rgba(15,76,92,0.1)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#0F4C5C', color: '#FFF' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Doctor Profile Details</span>
              <button onClick={() => setSelectedDoctor(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <h3 style={{ margin: 0, color: 'var(--primary-teal)', fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedDoctor.name}</h3>
              <div style={{ color: 'var(--secondary-forest)', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase' }}>{selectedDoctor.specialization}</div>
              
              <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.06)' }} />
              
              <div><strong>Clinic / Hospital:</strong> {selectedDoctor.clinic_name}</div>
              <div><strong>Address:</strong> {selectedDoctor.address}</div>
              {selectedDoctor.opening_hours && <div><strong>Opening Hours:</strong> {selectedDoctor.opening_hours}</div>}
              {selectedDoctor.phone && <div><strong>Phone Number:</strong> {selectedDoctor.phone}</div>}
              {selectedDoctor.website && (
                <div>
                  <strong>Website: </strong>
                  <a href={selectedDoctor.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-teal)', textDecoration: 'underline' }}>{selectedDoctor.website}</a>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAF9F6', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                <span>Rating: <strong>⭐� {selectedDoctor.rating}</strong> ({selectedDoctor.review_count} reviews)</span>
                <span>Distance: <strong>{selectedDoctor.distance_km} km</strong></span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords?.lat},${userCoords?.lon}&destination=${selectedDoctor.latitude},${selectedDoctor.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                >
                  ðŸ§­ Get Directions
                </a>
                {selectedDoctor.phone && (
                  <a 
                    href={`tel:${selectedDoctor.phone}`}
                    className="btn btn-accent"
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    ðŸ“ž Call Clinic
                  </a>
                )}
                <button className="btn btn-secondary" onClick={() => setSelectedDoctor(null)} style={{ flex: 1 }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
