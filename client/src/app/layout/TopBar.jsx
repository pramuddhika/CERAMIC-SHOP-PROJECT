import PropTypes from "prop-types";

const TopBar = ({ topic }) => {
  return (
    <div className="bg-slate-500 ">
      <p className="pt-3 pb-3 pl-3 text-2xl font-bold text-white">{topic}</p>
    </div>
  );
};

TopBar.propTypes = {
  topic: PropTypes.string,
};
export default TopBar;
