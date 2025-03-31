const DashBoard = () => {
  return (
    <div className="flex">
      <div className="col-4 flex flex-col h-full">
        <div className="h-[110px] min-w-full border-2 border-red-500">1</div>
        <div className="h-[110px] min-w-full border-2 border-red-500">2</div>
        <div className="h-[110px] min-w-full border-2 border-red-500">3</div>
        <div className="h-[110px] min-w-full border-2 border-red-500">4</div>
        <div className="h-[110px] min-w-full border-2 border-red-500">5</div>
        <div className="h-[110px] min-w-full border-2 border-red-500">6</div>
      </div>
      <div className="col-8">
        <div>
          <div className="h-[330px] min-w-full border-2 border-red-500">9</div>
        </div>
        <div className="flex">
          <div className="h-[330px] col-6">
          <div className="min-h-full min-w-full border-2 border-red-500">7</div>
        </div>
          <div className="h-[330px] col-6">
          <div className="min-h-full min-w-full border-2 border-red-500">8</div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
