import { memo } from 'react';

const CornerHUD = memo(() => (
  <>
    <div className="fixed top-0 left-0 p-6 border-l-[1px] border-t-[1px] border-white/20 w-24 h-24 z-40 pointer-events-none rounded-tl-xl opacity-50"></div>
    <div className="fixed top-0 right-0 p-6 border-r-[1px] border-t-[1px] border-white/20 w-24 h-24 z-40 pointer-events-none rounded-tr-xl opacity-50"></div>
    <div className="fixed bottom-0 left-0 p-6 border-l-[1px] border-b-[1px] border-white/20 w-24 h-24 z-40 pointer-events-none rounded-bl-xl opacity-50"></div>
    <div className="fixed bottom-0 right-0 p-6 border-r-[1px] border-b-[1px] border-white/20 w-24 h-24 z-40 pointer-events-none rounded-br-xl opacity-50"></div>
  </>
));

CornerHUD.displayName = 'CornerHUD';

const StaticUI = memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none z-[50]">
      <CornerHUD />
    </div>
  );
});

StaticUI.displayName = 'StaticUI';

export default StaticUI;