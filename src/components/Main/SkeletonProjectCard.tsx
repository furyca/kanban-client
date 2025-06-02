const SkeletonProjectCard = () => {
  return (
    <div className="w-full max-w-sm rounded-md border border-gray-500 mt-2 p-4 h-36">
      <div className="flex animate-pulse space-x-4">
        <div className="size-14 rounded-full bg-gray-500" />
        <div className="flex-1 space-y-6 py-1">
          <div className="h-4 rounded bg-gray-500" />
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-4 rounded bg-gray-500" />
              <div className="col-span-1 h-4 rounded bg-gray-500" />
            </div>
            <div className="h-4 rounded bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProjectCard;
