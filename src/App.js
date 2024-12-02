import React, { useState } from 'react';
import StartPage from './pages/StartPage';
import TrainModel from './pages/TrainModel';
import FeatureWeight from './pages/FeatureWeight';
import Summary from './pages/Summary';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: '1. Upload CSV', component: <StartPage /> },
    { label: '2. Train Model', component: <TrainModel /> },
    { label: '3. Define Feature Weights', component: <FeatureWeight /> },
    { label: '4. Produce Summary', component: <Summary /> },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 w-full">
      {/* Tabs Navigation */}
      <div className="w-full border-b bg-white sticky top-0 z-10">
        <div className="flex justify-between">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-3 cursor-pointer ${
                activeTab === index
                  ? 'border-b-2 border-green-500 text-gray-800 font-semibold'
                  : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 w-full max-w-4xl">{tabs[activeTab].component}</div>
    </div>
  );
};

export default Tabs;

// import React, { useState } from 'react';
// import StartPage from './pages/StartPage';
// import TrainModel from './pages/TrainModel';
// import FeatureWeight from './pages/FeatureWeight';
// import Summary from './pages/Summary';
//
// const Tabs = () => {
//   const [activeTab, setActiveTab] = useState(0);
//
//   const tabs = [
//     { label: '1. Upload CSV', component: <StartPage /> },
//     { label: '2. Train Model', component: <TrainModel /> },
//     { label: '3. Define Feature Weights', component: <FeatureWeight /> },
//     { label: '4. Produce Summary', component: <Summary /> },
//   ];
//
//   return (
//     <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 w-full min-w-full">
//       <div className="min-w-full">
//         {/* Tab Navigation */}
//         <div className="flex border-b">
//           {tabs.map((tab, index) => (
//             <button
//               key={index}
//               className={`py-2 px-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 border-b-2 ${
//                 activeTab === index
//                   ? 'border-green-500 text-gray-800'
//                   : 'border-transparent'
//               }`}
//               onClick={() => setActiveTab(index)}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//
//         {/* Tab Content */}
//         <div className="p-4">
//           {tabs[activeTab].component}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Tabs;