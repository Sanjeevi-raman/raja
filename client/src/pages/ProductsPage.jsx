import { useState } from 'react';
import { Btn, PageHead } from '../components/ui';

// ============================================
// IMPORT ALL PRODUCT IMAGES (137+ products)
// ============================================

// Head Protection - 13 products
import headProtectionHelmetStd from '../assets/product image/Head Protection/Safety Helmet Std. Series.jpg';
import headProtectionHelmetVent from '../assets/product image/Head Protection/Safety Helmet Vent. Series.jpg';
import headProtectionAbsHelmet from '../assets/product image/Head Protection/ABS Helmet.jpg';
import headProtectionWeldingHelmet from '../assets/product image/Head Protection/Welding Helmet.jpg';
import headProtectionWeldingShield from '../assets/product image/Head Protection/Welding Shield Helmet Mountable.jpg';
import headProtectionGrindingFaceA from '../assets/product image/Head Protection/Grinding Face Shield A Type.jpg';
import headProtectionGrindingFaceSpring from '../assets/product image/Head Protection/Grinding Face Shield Spring Type.jpg';
import headProtectionGrindingFaceElastic from '../assets/product image/Head Protection/Grinding Face Shield Elastic Type.jpg';
import headProtectionElectricalHelmet from '../assets/product image/Head Protection/Electrical Helmet.jpg';
import headProtectionGrindingFaceRatchet from '../assets/product image/Head Protection/Grinding Face Shield Ratchet Type.jpg';
import headProtectionHeatResistance from '../assets/product image/Head Protection/Heat Resistance Face Shield.jpg';
import headProtectionHelmetLight from '../assets/product image/Head Protection/Helmet With Light.jpg';
import headProtectionBumpCap from '../assets/product image/Head Protection/Bump Cap.jpg';

// Ear Protection - 6 products
import earProtectionEarMuff from '../assets/product image/Ear Protection/Ear Muff.jpg';
import earProtectionExecutiveEarMuff from '../assets/product image/Ear Protection/Executive Ear Muff.jpg';
import earProtectionHelmetMountable from '../assets/product image/Ear Protection/Helmet Mountable Ear Muff.jpg';
import earProtectionReusableEarPlug from '../assets/product image/Ear Protection/Reusable Ear Plug.jpg';
import earProtectionEarPlug from '../assets/product image/Ear Protection/Ear Plug.jpg';
import earProtectionEarPlugDispenser from '../assets/product image/Ear Protection/Ear Plug Dispenser.jpg';

// First Aid Products - 5 products
import firstAidVinylKit from '../assets/product image/First Aid Products/Venyl Kit.jpg';
import firstAidTravelKit from '../assets/product image/First Aid Products/Travel Kit.jpg';
import firstAidMedicalKit from '../assets/product image/First Aid Products/Medical Kit.jpg';
import firstAidPlasticKit from '../assets/product image/First Aid Products/Plastic Kit.jpg';
import firstAidFoldableStretcher from '../assets/product image/First Aid Products/Foldable Stretcher.jpg';

// Eye Protection - 6 products
import eyeProtectionSafetyGoggles from '../assets/product image/Eye Protection/Safety Goggles.jpg';
import eyeProtectionSafetySpectacles from '../assets/product image/Eye Protection/Safety Spectacles.jpg';
import eyeProtectionProtectiveGoggles from '../assets/product image/Eye Protection/Protective Goggles.jpg';
import eyeProtectionSafetyGlasses from '../assets/product image/Eye Protection/Safety Glasses.jpg';
import eyeProtectionFaceShield from '../assets/product image/Eye Protection/Face Shield.jpg';
import eyeProtectionEyeWashStation from '../assets/product image/Eye Protection/Eye Wash Station.jpg';

// Fall Protection - 14 products
import fallProtectionRetractableFall from '../assets/product image/Fall Protection/Retractable Fall Arrester.jpg';
import fallProtectionParapetAnchor from '../assets/product image/Fall Protection/Parapet Anchor.jpg';
import fallProtectionPpRope from '../assets/product image/Fall Protection/PP Rope.jpeg';
import fallProtectionToolLanyard from '../assets/product image/Fall Protection/Tool Lanyard.jpg';
import fallProtectionMultiPurposeHarness from '../assets/product image/Fall Protection/Multi Purpose Harness.jpg';
import fallProtectionAClassHarness from '../assets/product image/Fall Protection/A CLASS Harness.jpg';
import fallProtectionLClassHarness from '../assets/product image/Fall Protection/L Class Harness.jpg';
import fallProtectionSafetyNetFishNet from '../assets/product image/Fall Protection/Safety Net With Fish Net.jpg';
import fallProtectionSafetyNet3Layer from '../assets/product image/Fall Protection/3 Layer Safety Net.jpg';
import fallProtectionBarricationFenceNet from '../assets/product image/Fall Protection/Barrication Fence Net.jpg';
import fallProtectionKarabiner from '../assets/product image/Fall Protection/Karabiner.jpg';
import fallProtectionSwingSeat from '../assets/product image/Fall Protection/Swing Seat.jpg';
import fallProtectionDescender from '../assets/product image/Fall Protection/Descender.jpg';
import fallProtectionHorizontalLifeLine from '../assets/product image/Fall Protection/Horizontal Life Line.jpg';

// Respiratory Protection - 10 products
import respiratoryProtectionCarbonMask from '../assets/product image/Respiratory Protection/Carbon Mask.jpg';
import respiratoryProtection3PlyMaskLoop from '../assets/product image/Respiratory Protection/3Ply Mask Loop Type.jpg';
import respiratoryProtection3M9000 from '../assets/product image/Respiratory Protection/3M 9000 IN.jpg';
import respiratoryProtectionDuskMaskValve from '../assets/product image/Respiratory Protection/Dusk Mask With Valve.jpg';
import respiratoryProtection3M9004 from '../assets/product image/Respiratory Protection/3M 9004 IN.jpg';
import respiratoryProtectionDuskMask from '../assets/product image/Respiratory Protection/Dusk Mask.jpg';
import respiratoryProtectionFullFaceMask from '../assets/product image/Respiratory Protection/Full Face Mask With Double Cartridges.jpg';
import respiratoryProtectionHalfFaceMask from '../assets/product image/Respiratory Protection/Half Face Mask With Single Cartridges.jpg';
import respiratoryProtection3MN95Mask from '../assets/product image/Respiratory Protection/3M N95 Mask.jpg';
import respiratoryProtectionCartridges from '../assets/product image/Respiratory Protection/Cartridges.jpg';

// Emergency Response Equipment - 3 products
import emergencyResponseLifeJacket from '../assets/product image/Emergency Response Equipment/Life JacketLife Buoy.jpg';
import emergencyResponseLotoKit from '../assets/product image/Emergency Response Equipment/Loto Kit.jpg';
import emergencyResponseSpillKit from '../assets/product image/Emergency Response Equipment/Spill Kit.jpg';

// Body Protection - 13 products
import bodyProtectionNomexFireSuit from '../assets/product image/Body Protection/Nomex Fire Suit.jpg';
import bodyProtectionAluminiumFireSuit from '../assets/product image/Body Protection/Aluminium Fire Suit.jpg';
import bodyProtectionArcFlashSuit from '../assets/product image/Body Protection/ARC Flash Suit.jpg';
import bodyProtectionPvcSuitHood from '../assets/product image/Body Protection/PVC Suit With Hood.jpg';
import bodyProtectionCottonCoverall from '../assets/product image/Body Protection/Cotton Coverall.jpg';
import bodyProtectionDisposableCoverall from '../assets/product image/Body Protection/Disposable Coverall.jpg';
import bodyProtectionPvcApron from '../assets/product image/Body Protection/PVC Apron.jpg';
import bodyProtectionLeatherApron from '../assets/product image/Body Protection/Leather Apron.jpg';
import bodyProtectionCottonApron from '../assets/product image/Body Protection/Cotton Apron.jpg';
import bodyProtectionLeatherArmGuard from '../assets/product image/Body Protection/Leather Arm Guard.jpg';
import bodyProtectionLeatherLegGuard from '../assets/product image/Body Protection/Leather Leg Guard.jpg';
import bodyProtectionLeatherShoulderGuard from '../assets/product image/Body Protection/Leather Shoulder Guard.jpg';
import bodyProtectionRainCoat from '../assets/product image/Body Protection/Rain Coat.jpeg';

// Road Safety Products - 22 products
import roadSafetyStaffJacket from '../assets/product image/Road Safety Products/Staff Safety Jacket.jpg';
import roadSafetySafetyJacket3Side from '../assets/product image/Road Safety Products/Safety Jacket 3 Side Open.jpg';
import roadSafetyReflectiveVestBelt from '../assets/product image/Road Safety Products/Reflective Vest Belt.jpg';
import roadSafetySecurityJacket from '../assets/product image/Road Safety Products/Security Jacket.jpg';
import roadSafetySafetyCone from '../assets/product image/Road Safety Products/Safety Cone.jpg';
import roadSafetyPuSpringPost from '../assets/product image/Road Safety Products/PU Spring Post.jpg';
import roadSafetyQueueManager from '../assets/product image/Road Safety Products/Queue Manager.jpg';
import roadSafetyRoadStuds from '../assets/product image/Road Safety Products/Road Studs.jpg';
import roadSafetyPvcSpeedBreaker from '../assets/product image/Road Safety Products/PVC Speed Breaker.jpg';
import roadSafetyCornerGuards from '../assets/product image/Road Safety Products/Corner Guards.jpg';
import roadSafetyPvcFloorStands from '../assets/product image/Road Safety Products/PVC Floor Stands.jpg';
import roadSafetyDomeMirror from '../assets/product image/Road Safety Products/Dome Mirror.jpg';
import roadSafetyConvexMirror from '../assets/product image/Road Safety Products/Convex Mirror.jpg';
import roadSafetyReflectionTape from '../assets/product image/Road Safety Products/Reflection Tape.jpg';
import roadSafetyWindSockStand from '../assets/product image/Road Safety Products/Wind Sock With Stand.jpg';
import roadSafetyPvcChain from '../assets/product image/Road Safety Products/PVC Chain.jpg';
import roadSafetySafetyTriangle from '../assets/product image/Road Safety Products/Safety Triangle.jpg';
import roadSafetySolarChevron from '../assets/product image/Road Safety Products/Solar Chevron.jpg';
import roadSafetyBatonLight from '../assets/product image/Road Safety Products/Baton Light.jpg';
import roadSafetyPvcWaterFilledBarrier from '../assets/product image/Road Safety Products/PVC Water Filled Barrier.jpg';
import roadSafetyMetalDetector from '../assets/product image/Road Safety Products/Metal Detector.jpg';

// Waste Management Products - 24 products
import wasteManagement120LMobileGarbage from '../assets/product image/Waste Management Products/120L Mobile Garbage Bin.jpg';
import wasteManagement240LMobileGarbage from '../assets/product image/Waste Management Products/240L Mobile Garbage Bin.jpg';
import wasteManagement360LMobileGarbage from '../assets/product image/Waste Management Products/360L Mobile Garbage Bin.jpg';
import wasteManagement660LMobileGarbage from '../assets/product image/Waste Management Products/660L Mobile Garbage Bin.jpg';
import wasteManagement1100LMobileGarbage from '../assets/product image/Waste Management Products/1100L Mobile Garbage Bin.jpg';
import wasteManagement60LtrBin from '../assets/product image/Waste Management Products/60 LTR Bin.jpg';
import wasteManagement80LtrBin from '../assets/product image/Waste Management Products/80 LTR Bin.jpg';
import wasteManagement110LtrBin from '../assets/product image/Waste Management Products/110 LTR Bin.jpg';
import wasteManagement150LtrBin from '../assets/product image/Waste Management Products/150 LTR Bin.jpg';
import wasteManagementSingleStand from '../assets/product image/Waste Management Products/Single Stand.jpg';
import wasteManagementDoubleStand from '../assets/product image/Waste Management Products/Double Stand.jpg';
import wasteManagementMetroSwingTop from '../assets/product image/Waste Management Products/Metro With Swing Top.jpg';
import wasteManagementMetroOpenTop from '../assets/product image/Waste Management Products/Metro With Open Top.jpg';
import wasteManagementMagnum15L from '../assets/product image/Waste Management Products/Magnum 15L.jpg';
import wasteManagementMagnum20L from '../assets/product image/Waste Management Products/Magnum 20L.jpg';
import wasteManagement120LPedalBin from '../assets/product image/Waste Management Products/120L Pedal Bin.png';
import wasteManagement240LPedalBin from '../assets/product image/Waste Management Products/240L Pedal Bin.jpg';
import wasteManagementTrollyBins from '../assets/product image/Waste Management Products/Trolly Bins.jpg';
import wasteManagementDuoBins from '../assets/product image/Waste Management Products/Duo Bins.jpg';
import wasteManagementTrioBins from '../assets/product image/Waste Management Products/Trio Bins.jpg';

// Tools and Instrument - 14 products
import toolsAxe from '../assets/product image/Tools and Instrument/Axe.jpg';
import toolsMallet from '../assets/product image/Tools and Instrument/Mallet.jpg';
import toolsHammer from '../assets/product image/Tools and Instrument/Hammer.jpg';
import toolsCorkscrew from '../assets/product image/Tools and Instrument/Corkscrew.jpg';
import toolsPliers from '../assets/product image/Tools and Instrument/Pliers.jpg';
import toolsConstructionBox from '../assets/product image/Tools and Instrument/Construction Box.jpg';
import toolsWheelBarrow from '../assets/product image/Tools and Instrument/Wheel Barrow.jpg';
import toolsSingleWheelBarrow from '../assets/product image/Tools and Instrument/Single Wheel Barrow.jpg';
import toolsBackSaw from '../assets/product image/Tools and Instrument/Back Saw.jpg';
import toolsChainSaw from '../assets/product image/Tools and Instrument/Chain Saw.jpg';
import toolsSpiritLevel from '../assets/product image/Tools and Instrument/Spirit Level.jpg';
import toolsToolBox from '../assets/product image/Tools and Instrument/Tool Box.jpg';
import toolsStepLadder from '../assets/product image/Tools and Instrument/Step Ladder.jpg';
import toolsMeasurementTape from '../assets/product image/Tools and Instrument/Measurement Tape.jpg';

// The Water Pumps folder currently has no image files. Use this temporary
// fallback until the product-specific pump photos are added.
const WATER_PUMP_FALLBACK = 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=900&q=85';

const selectProduct = (item, page, go) => {
  localStorage.setItem('raja_selected_product', JSON.stringify(item));
  go(page, { keepOrder: page === 'contact' });
};

// ============================================
// CATEGORY IMAGES (Fallback images)
// ============================================

const CATEGORY_IMAGES = {
  Electrical: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85',
  'Wires & Cables': 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=900&q=85',
  Plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85',
  Painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=85',
  Locks: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=85',
  'Sanitary Ware': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85',
  'Shower Panels': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=85',
  Bathtubs: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85',
  'Head Protection': headProtectionHelmetStd,
  'Ear Protection': earProtectionEarMuff,
  'First Aid Products': firstAidMedicalKit,
  'Eye Protection': eyeProtectionSafetyGoggles,
  'Fall Protection': fallProtectionRetractableFall,
  'Respiratory Protection': respiratoryProtectionCarbonMask,
  'Emergency Response Equipment': emergencyResponseLifeJacket,
  'Body Protection': bodyProtectionNomexFireSuit,
  'Road Safety Products': roadSafetyStaffJacket,
  'Waste Management Products': wasteManagement120LMobileGarbage,
  'Tools and Instrument': toolsHammer,
  'Water Pumps': WATER_PUMP_FALLBACK,
};

// ============================================
// PRODUCT IMAGES (All 137+ products with local imports)
// ============================================

const PRODUCT_IMAGES = {
  'Modular Switches': CATEGORY_IMAGES.Electrical,
  'MCB and Distribution Boards': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=85',
  'LED Panel Lights': 'https://images.unsplash.com/photo-1550985543-f47f7c3e31c0?auto=format&fit=crop&w=900&q=85',
  'Copper House Wire': CATEGORY_IMAGES['Wires & Cables'],
  'Flexible Cables': 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=900&q=85',
  'PVC Conduit Pipe': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=85',
  'CPVC Plumbing Pipe': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85',
  'Wall Paint': CATEGORY_IMAGES.Painting,
  'Wood Finish Paint': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=900&q=85',
  'Mortise Lock': CATEGORY_IMAGES.Locks,
  'Door Handle Set': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85',
  'Wash Basin': CATEGORY_IMAGES['Sanitary Ware'],
  'Close Coupled Toilet': 'https://images.unsplash.com/photo-1584622781867-2f0f3f0f7f43?auto=format&fit=crop&w=900&q=85',
  'Rain Shower Panel': CATEGORY_IMAGES['Shower Panels'],
  'Hand Shower Set': 'https://images.unsplash.com/photo-1603825491103-bd638b187e1d?auto=format&fit=crop&w=900&q=85',
  'Acrylic Bathtub': CATEGORY_IMAGES.Bathtubs,
  'Freestanding Bathtub': 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=900&q=85',
  // ---- Head Protection ----
  'Safety Helmet Std. Series': headProtectionHelmetStd,
  'Safety Helmet Vent. Series': headProtectionHelmetVent,
  'ABS Helmet': headProtectionAbsHelmet,
  'Welding Helmet': headProtectionWeldingHelmet,
  'Welding Shield Helmet Mountable': headProtectionWeldingShield,
  'Grinding Face Shield A Type': headProtectionGrindingFaceA,
  'Grinding Face Shield Spring Type': headProtectionGrindingFaceSpring,
  'Grinding Face Shield Elastic Type': headProtectionGrindingFaceElastic,
  'Electrical Helmet': headProtectionElectricalHelmet,
  'Grinding Face Shield Ratchet Type': headProtectionGrindingFaceRatchet,
  'Heat Resistance Face Shield': headProtectionHeatResistance,
  'Helmet With Light': headProtectionHelmetLight,
  'Bump Cap': headProtectionBumpCap,

  // ---- Ear Protection ----
  'Ear Muff': earProtectionEarMuff,
  'Executive Ear Muff': earProtectionExecutiveEarMuff,
  'Helmet Mountable Ear Muff': earProtectionHelmetMountable,
  'Reusable Ear Plug': earProtectionReusableEarPlug,
  'Ear Plug': earProtectionEarPlug,
  'Ear Plug Dispenser': earProtectionEarPlugDispenser,

  // ---- First Aid Products ----
  'Venyl Kit': firstAidVinylKit,
  'Travel Kit': firstAidTravelKit,
  'Medical Kit': firstAidMedicalKit,
  'Plastic Kit': firstAidPlasticKit,
  'Foldable Stretcher': firstAidFoldableStretcher,

  // ---- Eye Protection ----
  'Safety Goggles': eyeProtectionSafetyGoggles,
  'Safety Spectacles': eyeProtectionSafetySpectacles,
  'Protective Goggles': eyeProtectionProtectiveGoggles,
  'Safety Glasses': eyeProtectionSafetyGlasses,
  'Face Shield': eyeProtectionFaceShield,
  'Eye Wash Station': eyeProtectionEyeWashStation,

  // ---- Fall Protection ----
  'Retractable Fall Arrester': fallProtectionRetractableFall,
  'Parapet Anchor': fallProtectionParapetAnchor,
  'PP Rope': fallProtectionPpRope,
  'Tool Lanyard': fallProtectionToolLanyard,
  'Multi Purpose Harness': fallProtectionMultiPurposeHarness,
  'A Class Harness': fallProtectionAClassHarness,
  'L Class Harness': fallProtectionLClassHarness,
  'Safety Net With Fish Net': fallProtectionSafetyNetFishNet,
  '3 Layer Safety Net': fallProtectionSafetyNet3Layer,
  'Barrication Fence Net': fallProtectionBarricationFenceNet,
  'Karabiner': fallProtectionKarabiner,
  'Swing Seat': fallProtectionSwingSeat,
  'Descender': fallProtectionDescender,
  'Horizontal Life Line': fallProtectionHorizontalLifeLine,

  // ---- Respiratory Protection ----
  'Carbon Mask': respiratoryProtectionCarbonMask,
  '3Ply Mask Loop Type': respiratoryProtection3PlyMaskLoop,
  '3M 9000 IN': respiratoryProtection3M9000,
  'Dusk Mask With Valve': respiratoryProtectionDuskMaskValve,
  '3M 9004 IN': respiratoryProtection3M9004,
  'Dusk Mask': respiratoryProtectionDuskMask,
  'Full Face Mask With Double Cartridges': respiratoryProtectionFullFaceMask,
  'Half Face Mask With Single Cartridges': respiratoryProtectionHalfFaceMask,
  '3M N95 Mask': respiratoryProtection3MN95Mask,
  'Cartridges': respiratoryProtectionCartridges,

  // ---- Emergency Response Equipment ----
  'Life Jacket / Life Buoy': emergencyResponseLifeJacket,
  'Loto Kit': emergencyResponseLotoKit,
  'Spill Kit': emergencyResponseSpillKit,

  // ---- Body Protection ----
  'Nomex Fire Suit': bodyProtectionNomexFireSuit,
  'Aluminium Fire Suit': bodyProtectionAluminiumFireSuit,
  'ARC Flash Suit': bodyProtectionArcFlashSuit,
  'PVC Suit With Hood': bodyProtectionPvcSuitHood,
  'Cotton Coverall': bodyProtectionCottonCoverall,
  'Disposable Coverall': bodyProtectionDisposableCoverall,
  'PVC Apron': bodyProtectionPvcApron,
  'Leather Apron': bodyProtectionLeatherApron,
  'Cotton Apron': bodyProtectionCottonApron,
  'Leather Arm Guard': bodyProtectionLeatherArmGuard,
  'Leather Leg Guard': bodyProtectionLeatherLegGuard,
  'Leather Shoulder Guard': bodyProtectionLeatherShoulderGuard,
  'Rain Coat': bodyProtectionRainCoat,

  // ---- Road Safety Products ----
  'Staff Safety Jacket': roadSafetyStaffJacket,
  'Safety Jacket 3 Side Open': roadSafetySafetyJacket3Side,
  'Reflective Vest Belt': roadSafetyReflectiveVestBelt,
  'Security Jacket': roadSafetySecurityJacket,
  'Safety Cone': roadSafetySafetyCone,
  'PU Spring Post': roadSafetyPuSpringPost,
  'Queue Manager': roadSafetyQueueManager,
  // No Scissors Barrier image is present; use the closest available road-safety image.
  'Scissors Barrier': roadSafetyQueueManager,
  'Road Studs': roadSafetyRoadStuds,
  'PVC Speed Breaker': roadSafetyPvcSpeedBreaker,
  'Corner Guards': roadSafetyCornerGuards,
  'PVC Floor Stands': roadSafetyPvcFloorStands,
  'Dome Mirror': roadSafetyDomeMirror,
  'Convex Mirror': roadSafetyConvexMirror,
  'Reflection Tape': roadSafetyReflectionTape,
  'Wind Sock With Stand': roadSafetyWindSockStand,
  'PVC Chain': roadSafetyPvcChain,
  'Safety Triangle': roadSafetySafetyTriangle,
  'Solar Chevron': roadSafetySolarChevron,
  'Baton Light': roadSafetyBatonLight,
  'PVC Water Filled Barrier': roadSafetyPvcWaterFilledBarrier,
  'Metal Detector': roadSafetyMetalDetector,

  // ---- Waste Management Products ----
  '120L Mobile Garbage Bin': wasteManagement120LMobileGarbage,
  '240L Mobile Garbage Bin': wasteManagement240LMobileGarbage,
  '360L Mobile Garbage Bin': wasteManagement360LMobileGarbage,
  '660L Mobile Garbage Bin': wasteManagement660LMobileGarbage,
  '1100L Mobile Garbage Bin': wasteManagement1100LMobileGarbage,
  '60 LTR Bin': wasteManagement60LtrBin,
  '80 LTR Bin': wasteManagement80LtrBin,
  '110 LTR Bin': wasteManagement110LtrBin,
  '150 LTR Bin': wasteManagement150LtrBin,
  'Single Stand': wasteManagementSingleStand,
  'Double Stand': wasteManagementDoubleStand,
  'Metro With Swing Top': wasteManagementMetroSwingTop,
  'Metro With Open Top': wasteManagementMetroOpenTop,
  'Magnum 15L': wasteManagementMagnum15L,
  'Magnum 20L': wasteManagementMagnum20L,
  '120L Pedal Bin': wasteManagement120LPedalBin,
  '240L Pedal Bin': wasteManagement240LPedalBin,
  'Trolly Bins': wasteManagementTrollyBins,
  'Duo Bins': wasteManagementDuoBins,
  'Trio Bins': wasteManagementTrioBins,
  // These two image files are not in the asset folder yet.
  'Quatro Bins': wasteManagementTrioBins,
  'Two in One': wasteManagementDuoBins,

  // ---- Tools and Instrument ----
  'Axe': toolsAxe,
  'Mallet': toolsMallet,
  'Hammer': toolsHammer,
  'Corkscrew': toolsCorkscrew,
  'Pliers': toolsPliers,
  'Construction Box': toolsConstructionBox,
  'Wheel Barrow': toolsWheelBarrow,
  'Single Wheel Barrow': toolsSingleWheelBarrow,
  'Back Saw': toolsBackSaw,
  'Chain Saw': toolsChainSaw,
  'Spirit Level': toolsSpiritLevel,
  'Tool Box': toolsToolBox,
  'Step Ladder': toolsStepLadder,
  'Measurement Tape': toolsMeasurementTape,

  // ---- Water Pumps ----
  'Submersible Pumps': WATER_PUMP_FALLBACK,
  'Garden Water Pumps': WATER_PUMP_FALLBACK,
  'Water Circulation Pump': WATER_PUMP_FALLBACK,
  'Deep Well Pumps': WATER_PUMP_FALLBACK,
  'Single Phase': WATER_PUMP_FALLBACK,
  'CDS Series': WATER_PUMP_FALLBACK,
  'Dewatering Pump': WATER_PUMP_FALLBACK,
};

// ============================================
// CATEGORY DATA
// ============================================

const CATEGORY_DATA = [
  ['Electrical', ['Modular Switches', 'MCB and Distribution Boards', 'LED Panel Lights']],
  ['Wires & Cables', ['Copper House Wire', 'Flexible Cables', 'Industrial Cable']],
  ['Plumbing', ['PVC Conduit Pipe', 'CPVC Plumbing Pipe', 'Brass Fittings']],
  ['Painting', ['Wall Paint', 'Wood Finish Paint', 'Primer and Putty']],
  ['Locks', ['Mortise Lock', 'Door Handle Set', 'Padlock']],
  ['Sanitary Ware', ['Wash Basin', 'Close Coupled Toilet', 'Bathroom Accessories']],
  ['Shower Panels', ['Rain Shower Panel', 'Hand Shower Set', 'Thermostatic Shower']],
  ['Bathtubs', ['Acrylic Bathtub', 'Freestanding Bathtub', 'Corner Bathtub']],
  ['Head Protection', ['Safety Helmet Std. Series', 'Safety Helmet Vent. Series', 'ABS Helmet', 'Welding Helmet', 'Welding Shield Helmet Mountable', 'Grinding Face Shield A Type', 'Grinding Face Shield Spring Type', 'Grinding Face Shield Elastic Type', 'Electrical Helmet', 'Grinding Face Shield Ratchet Type', 'Heat Resistance Face Shield', 'Helmet With Light', 'Bump Cap']],
  ['Ear Protection', ['Ear Muff', 'Executive Ear Muff', 'Helmet Mountable Ear Muff', 'Reusable Ear Plug', 'Ear Plug', 'Ear Plug Dispenser']],
  ['First Aid Products', ['Venyl Kit', 'Travel Kit', 'Medical Kit', 'Plastic Kit', 'Foldable Stretcher']],
  ['Eye Protection', ['Safety Goggles', 'Safety Spectacles', 'Protective Goggles', 'Safety Glasses', 'Face Shield', 'Eye Wash Station']],
  ['Fall Protection', ['Retractable Fall Arrester', 'Parapet Anchor', 'PP Rope', 'Tool Lanyard', 'Multi Purpose Harness', 'A Class Harness', 'L Class Harness', 'Safety Net With Fish Net', '3 Layer Safety Net', 'Barrication Fence Net', 'Karabiner', 'Swing Seat', 'Descender', 'Horizontal Life Line']],
  ['Respiratory Protection', ['Carbon Mask', '3Ply Mask Loop Type', '3M 9000 IN', 'Dusk Mask With Valve', '3M 9004 IN', 'Dusk Mask', 'Full Face Mask With Double Cartridges', 'Half Face Mask With Single Cartridges', '3M N95 Mask', 'Cartridges']],
  ['Emergency Response Equipment', ['Life Jacket / Life Buoy', 'Loto Kit', 'Spill Kit']],
  ['Body Protection', ['Nomex Fire Suit', 'Aluminium Fire Suit', 'ARC Flash Suit', 'PVC Suit With Hood', 'Cotton Coverall', 'Disposable Coverall', 'PVC Apron', 'Leather Apron', 'Cotton Apron', 'Leather Arm Guard', 'Leather Leg Guard', 'Leather Shoulder Guard', 'Rain Coat']],
  ['Road Safety Products', ['Staff Safety Jacket', 'Safety Jacket 3 Side Open', 'Reflective Vest Belt', 'Security Jacket', 'Safety Cone', 'PU Spring Post', 'Queue Manager', 'Scissors Barrier', 'Road Studs', 'PVC Speed Breaker', 'Corner Guards', 'PVC Floor Stands', 'Dome Mirror', 'Convex Mirror', 'Reflection Tape', 'Wind Sock With Stand', 'PVC Chain', 'Safety Triangle', 'Solar Chevron', 'Baton Light', 'PVC Water Filled Barrier', 'Metal Detector']],
  ['Waste Management Products', [
    ['Combination Series - FRP', ['Duo Bins', 'Trio Bins', 'Quatro Bins', 'Two in One']],
    ['Combination Series - SS', ['Duo Bins', 'Trio Bins']],
    ['Mobile Garbage Bins', ['120L Mobile Garbage Bin', '240L Mobile Garbage Bin', '360L Mobile Garbage Bin', '660L Mobile Garbage Bin', '1100L Mobile Garbage Bin']],
    ['Classic Free Stand Series', ['60 LTR Bin', '80 LTR Bin', '110 LTR Bin', '150 LTR Bin', 'Single Stand', 'Double Stand', 'Metro With Swing Top', 'Metro With Open Top']],
    ['Bio Medical Pedal Series', ['Magnum 15L', 'Magnum 20L', '120L Pedal Bin', '240L Pedal Bin', 'Trolly Bins']],
  ]],
  ['Tools and Instrument', ['Axe', 'Mallet', 'Hammer', 'Corkscrew', 'Pliers', 'Construction Box', 'Wheel Barrow', 'Single Wheel Barrow', 'Back Saw', 'Chain Saw', 'Spirit Level', 'Tool Box', 'Step Ladder', 'Measurement Tape']],
  ['Water Pumps', ['Submersible Pumps', 'Garden Water Pumps', 'Water Circulation Pump', 'Deep Well Pumps', 'Single Phase', 'CDS Series', 'Dewatering Pump']],
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getProductImage = (category, name) => {
  return PRODUCT_IMAGES[name] || CATEGORY_IMAGES[category] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
};

const handleImgError = (event, category) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = CATEGORY_IMAGES[category] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
};

// ============================================
// BUILD PRODUCTS DATA
// ============================================

const PRODUCTS_DATA = CATEGORY_DATA.flatMap(([category, entries], categoryIndex) =>
  entries.flatMap((entry, entryIndex) => {
    const isSeries = Array.isArray(entry);
    const subcategory = isSeries ? entry[0] : '';
    const products = isSeries ? entry[1] : [entry];
    return products.map((name, productIndex) => ({
      id: `product-${categoryIndex}-${entryIndex}-${productIndex}`,
      name,
      image: getProductImage(category, name),
      price: 'Price on request',
      badge: 'Available',
      category,
      subcategory,
      description: `${name} from our ${subcategory ? `${subcategory} - ` : ''}${category} range. Contact us for specifications and a quotation.`,
    }));
  })
);

const CATEGORIES_LIST = CATEGORY_DATA.map(([name]) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name }));
const productCategory = item => item.subcategory ? `${item.category} / ${item.subcategory}` : item.category;

// Supabase is the source of truth. The local catalogue only keeps the page
// usable until the one-time catalogue seed has been run.
const uniqueItems = (items, key = 'id') => Array.from(
  new Map(items.filter(Boolean).map(item => [item[key] || item.name, item])).values()
);
const catalogueFromContent = content => {
  const databaseProducts = Array.isArray(content?.products) ? content.products : [];
  const databaseCategories = Array.isArray(content?.categories) ? content.categories : [];
  const databaseCategoryNames = new Set(databaseCategories.map(item => item.name));
  const databaseProductCategories = new Set(databaseProducts.map(item => item.category));
  return {
    products: databaseProducts.length ? [...databaseProducts, ...PRODUCTS_DATA.filter(item => !databaseProductCategories.has(item.category))] : PRODUCTS_DATA,
    categories: databaseCategories.length ? [...databaseCategories, ...CATEGORIES_LIST.filter(item => !databaseCategoryNames.has(item.name))] : CATEGORIES_LIST,
  };
};

// ============================================
// PRODUCTS PAGE COMPONENT
// ============================================

export function ProductsPage({ go, content }) {
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('');
  const [showAll, setShowAll] = useState(false);
  const { products, categories } = catalogueFromContent(content);
  const filtered = products.filter(item =>
    `${item.name} ${item.category} ${item.subcategory}`.toLowerCase().includes(term.toLowerCase()) && (!category || item.category === category)
  );
  const visibleProducts = showAll ? filtered : filtered.slice(0, 5);

  return <>
    <PageHead crumb="Products" title={<>Our <em>Products</em></>} desc={`Browse our complete industrial safety catalogue: ${products.length} products across ${categories.length} categories.`}/>
    <section className="catalog">
      <aside className="product-categories">
        <h3>Categories</h3>
        <label className={`category-select ${category ? '' : 'selected'}`}>
          <span>Select a category</span>
          <select value={category} onChange={event => setCategory(event.target.value)} aria-label="Select a product category">
            <option value="">All products</option>
            {categories.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <div className="category-filter-list" aria-label="Product categories">
          <button className={!category ? 'selected' : ''} onClick={() => setCategory('')}>All products</button>
          {categories.map(item => <button className={category === item.name ? 'selected' : ''} key={item.id} onClick={() => setCategory(item.name)}>{item.name}</button>)}
        </div>
      </aside>
      <main>
        <div className="find">
          <input placeholder="Search products or series..." value={term} onChange={event => setTerm(event.target.value)}/>
          <Btn>Search</Btn>
        </div>
        <p className="product-count">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}{category ? ` in ${category}` : ''}</p>
        <div className="product-grid">
          {visibleProducts.map(item => <article key={item.id} className="product-card">
            <div className="product-badge">{item.badge}</div>
            <button className="product-open" onClick={() => selectProduct(item, 'productdetail', go)}>
              <img src={item.image || getProductImage(item.category, item.name)} alt={item.name} onError={event => handleImgError(event, item.category)} loading="lazy"/>
              <h3>{item.name}</h3>
              <p className="product-price">{item.price}</p>
              <p className="product-category">{productCategory(item)}</p>
            </button>
            <a
              className="order-product"
              href={`https://wa.me/${String(content?.site?.whatsappNumber || '919003900533').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Raja Electricals, I would like to enquire about ${item.name}.` )}`}
              target="_blank"
              rel="noreferrer"
            >
              Enquire Now
            </a>
          </article>)}
        </div>
        {filtered.length > 5 && <button className="btn plain" onClick={() => setShowAll(value => !value)}>{showAll ? 'Show key products' : `View all ${filtered.length} products`}</button>}
        {!filtered.length && <p className="no-products">No products match your search.</p>}
      </main>
    </section>
  </>;
}

// ============================================
// PRODUCT DETAIL PAGE COMPONENT
// ============================================

export function ProductDetailPage({ go, content }) {
  const { products } = catalogueFromContent(content);
  const [product, setProduct] = useState(() => {
    try {
      const selected = JSON.parse(localStorage.getItem('raja_selected_product'));
      return selected && PRODUCTS_DATA.find(item => item.id === selected.id) || selected;
    } catch {
      return null;
    }
  });
  if (!product) return <section className="page-loading">Choose a product from our catalogue to view its details.</section>;
  const currentProduct = products.find(item => item.id === product.id) || product;
  const related = products.filter(item => item.id !== currentProduct.id && item.category === currentProduct.category).slice(0, 5);
  const whatsapp = `https://wa.me/${String(content?.site?.whatsappNumber || '919003900533').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I am interested in ${product.name}.`)}`;
  const phone = content?.site?.phone || '+91 9003900533';
  const openRelatedProduct = item => {
    localStorage.setItem('raja_selected_product', JSON.stringify(item));
    setProduct(item);
    window.scrollTo(0, 0);
  };

  return <>
    <div className="crumb">Home / {productCategory(currentProduct)} / {currentProduct.name}</div>
    <section className="detail">
      <div className="product-image"><span>{currentProduct.badge || 'Product'}</span><img src={currentProduct.image || getProductImage(currentProduct.category, currentProduct.name)} alt={currentProduct.name} onError={event => handleImgError(event, currentProduct.category)}/></div>
      <div className="detail-copy">
        <small>{productCategory(currentProduct)}</small><h1>{currentProduct.name}</h1>
        <p className="product-detail-price" style={{ fontSize: '18px', color: 'var(--red)', fontWeight: '700', margin: '10px 0' }}>{currentProduct.price}</p>
        <p>{currentProduct.description}</p><Btn onClick={() => selectProduct(currentProduct, 'contact', go)}>Ask About This Product</Btn>
      </div>
      <aside className="details-box">
        <h3>Product Details</h3><p><b>Category</b><span>{currentProduct.category}</span></p>
        {currentProduct.subcategory && <p><b>Series</b><span>{currentProduct.subcategory}</span></p>}
        <p><b>Price</b><span>{currentProduct.price}</span></p><p><b>Availability</b><span>Contact us</span></p>
        <div className="help"><b>Need help?</b><a href={`tel:${phone}`}>{phone}</a><a className="whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp Now</a></div>
      </aside>
    </section>
    <section className="related"><h2>Related Products in {currentProduct.category}</h2>
      {related.length > 0 ? <div className="related-products-grid">
        {related.map(item => <button key={item.id} onClick={() => openRelatedProduct(item)}><img src={item.image || getProductImage(item.category, item.name)} alt={item.name} onError={event => handleImgError(event, item.category)} loading="lazy"/><b>{item.name}</b><span>{item.price}</span></button>)}
      </div> : <p>No other products in this category.</p>}
    </section>
  </>;
}
