import apiCall from './apiCall';

const PcSpecForm = () => {
  const presetConfigs = [
    { cpu: "i5-12400F", gpu: "RTX 3060", ram: "16GB" },
    { cpu: "i7-13700K", gpu: "RTX 4070", ram: "32GB" },
    { cpu: "i9-13900K", gpu: "RTX 4090", ram: "64GB" }
  ];

  const onSubmit = (specs: typeof presetConfigs[0]) => {
    const formattedData = `CPU ${specs.cpu} with GPU ${specs.gpu} and RAM ${specs.ram}`;
    apiCall.get(formattedData);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8">
      {presetConfigs.map((config, index) => (
        <button
          key={index}
          onClick={() => onSubmit(config)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {`${config.cpu} | ${config.gpu} | ${config.ram}`}
        </button>
      ))}
    </div>
  );
};

export default PcSpecForm;