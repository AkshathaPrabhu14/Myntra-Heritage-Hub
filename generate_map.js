const fs = require('fs');

const svgData = JSON.parse(fs.readFileSync('D:/myntra/NewMyntra/svg_data.json', 'utf8'));

const craftMap = {
  'jammu-kashmir': 'Pashmina Shawls & Walnut Wood Carvings',
  'punjab': 'Phulkari Hand Embroidery',
  'rajasthan': 'Blue Pottery & Bandhani Textiles',
  'gujarat': 'Patan Patola Silks & Lippan Wall Art',
  'maharashtra': 'Paithani Sarees & Warli Folk Art',
  'karnataka': 'Channapatna Wooden Toys & Sandalwood Carving',
  'kerala': 'Kasavu Handlooms & Aranmula Metal Mirrors',
  'tamilnadu': 'Kanchipuram Silk Sarees & Tanjore Paintings',
  'odisha': 'Sambalpuri Ikat Weaves & Pattachitra Art',
  'westbengal': 'Kantha Stitch Embroideries & Jamdani Sarees',
  'assam': 'Rare Golden Muga Silk & Cane Crafts',
  'madhyapradesh': 'Chanderi Handlooms & Bagh Block Prints',
  'uttarpradesh': 'Banarasi Silk Sarees & Chikankari Embroidery',
  'ladakh': 'Pashmina wool crafts & Thangka scroll paintings',
  'himachal-pradesh': 'Kullu handloom shawls & Chamba Rumal',
  'chandigarh': 'Rock Garden recycled art & Phulkari',
  'uttarakhand': 'Aipan folk art & Ringal bamboo craft',
  'haryana': 'Phulkari embroidery & handloom durries',
  'delhi': 'Zardozi embroidery & Meenakari jewelry',
  'goa': 'Kunbi weaving & terracotta pottery',
  'chhattisgarh': 'Bell metal (Dokra) craft & Kosa silk',
  'bihar': 'Madhubani folk paintings & Sujani embroidery',
  'jharkhand': 'Dokra metal casting & Sohrai wall art',
  'sikkim': 'Thangka paintings & handmade carpets',
  'arunachal-pradesh': 'Carpet weaving & bamboo/cane work',
  'nagaland': 'Naga shawls & intricate bead jewelry',
  'manipur': 'Kauna reed craft & Moirang Phee handlooms',
  'mizoram': 'Puan weaving & bamboo craft',
  'tripura': 'Rignai and Risa weaving',
  'meghalaya': 'Cane and bamboo craft & Eri silk',
  'telangana': 'Nirmal paintings & Pochampally Ikat',
  'andhra-pradesh': 'Kalamkari textiles & Kondapalli wooden toys',
  'puducherry': 'Pottery & handloom textiles',
  'lakshadweep': 'Coir craft & shell jewelry',
  'andaman-nicobar': 'Shell craft & Nicobari weaving',
  'dadra-nagar-haveli': 'Warli folk paintings & traditional weaving'
};

const mapName = (name) => {
  if (name === "Orissa") return "odisha";
  if (name === "Uttaranchal") return "uttarakhand";
  if (name === "Jammu and Kashmir") return "jammu-kashmir";
  if (name === "Andaman and Nicobar") return "andaman-nicobar";
  if (name === "Dādra and Nagar Haveli and Damān and Diu") return "dadra-nagar-haveli";
  if (name === "West Bengal") return "westbengal"; 
  if (name === "Madhya Pradesh") return "madhyapradesh"; 
  if (name === "Uttar Pradesh") return "uttarpradesh"; 
  if (name === "Tamil Nadu") return "tamilnadu"; 
  
  return name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '');
};

const statesObj = svgData.map(d => {
  const id = mapName(d.name);
  let displayName = d.name;
  if (displayName === "Orissa") displayName = "Odisha";
  if (displayName === "Uttaranchal") displayName = "Uttarakhand";
  if (displayName === "Jammu and Kashmir") displayName = "Jammu & Kashmir";
  if (displayName === "Andaman and Nicobar") displayName = "Andaman & Nicobar Islands";
  if (displayName === "Dādra and Nagar Haveli and Damān and Diu") displayName = "Dadra & Nagar Haveli and Daman & Diu";
  
  const craft = craftMap[id] || 'Explore authentic handlooms, handicrafts, and regional heritage treasures.';
  
  return {
    id,
    displayName,
    craft,
    path: d.d
  };
});

const fileContent = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndiaMap = () => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const states = ${JSON.stringify(statesObj, null, 4)};

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 70,
    });
  };

  const handleStateClick = (stateId) => {
    navigate(\`/heritage/\${stateId}\`);
  };

  return (
    <div className="relative w-full max-w-[800px] mx-auto bg-white rounded-3xl p-4 border border-gray-100 shadow-sm overflow-hidden select-none">
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-myntra-pink block mb-1">
          State Exploration
        </span>
        <h3 className="font-extrabold text-lg text-myntra-dark">
          Click a State to Discover Local Crafts
        </h3>
      </div>

      <div className="relative w-full h-auto aspect-[1000/1000]" onMouseMove={handleMouseMove}>
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {states.map((st) => (
            <path
              key={st.id}
              d={st.path}
              className="fill-slate-100 stroke-white stroke-2 cursor-pointer transition-all duration-300 hover:fill-pink-500/80 hover:stroke-myntra-pink hover:filter hover:drop-shadow-[0_4px_10px_rgba(255,63,108,0.3)]"
              onClick={() => handleStateClick(st.id)}
              onMouseEnter={() => setHoveredState(st)}
              onMouseLeave={() => setHoveredState(null)}
            />
          ))}
        </svg>

        {hoveredState && (
          <div
            className="absolute bg-myntra-dark text-white rounded-xl p-3.5 shadow-2xl border border-slate-700/50 pointer-events-none z-30 w-[240px] transition-all duration-100 ease-out"
            style={{ left: \`\${tooltipPos.x}px\`, top: \`\${tooltipPos.y}px\` }}
          >
            <h4 className="font-extrabold text-sm border-b border-slate-700 pb-1.5 mb-1.5 flex items-center justify-between">
              <span>{hoveredState.displayName}</span>
              <span className="text-[9px] bg-myntra-pink text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                Explore
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              Signature Craft
            </p>
            <p className="text-[11px] font-semibold text-pink-300 leading-snug">
              {hoveredState.craft}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaMap;
`;

fs.writeFileSync('D:/myntra/NewMyntra/NewMyntra/frontend/src/components/IndiaMap.jsx', fileContent, 'utf8');
console.log('Successfully generated IndiaMap.jsx with 36 states.');
