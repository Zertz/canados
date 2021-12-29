type Props = {
  subtitle: string;
  title: string;
};

export default function LoadingOverlay({ subtitle, title }: Props) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center"
      style={{ zIndex: 1000 }}
    >
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl text-center transform transition-all sm:max-w-sm sm:w-full sm:p-6">
        <h3 className="mb-2 text-lg leading-6 font-medium text-gray-900">
          {title}
        </h3>
        <p className="text-sm leading-5 text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
