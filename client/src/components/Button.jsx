import React from "react";

const Button = ({
  type,
  title,
  customStyle = "w-full",
  icon,
  onClickfunc,
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClickfunc}
      disabled={loading}
      className={`bg-[#ffc224] font-semibold border-[1.5px] rounded-full py-2 
        hover:bg-[#5751e1] hover:border-[#5751e1] hover:text-white 
        custom-boxShadow  transition-all duration-1000 ease-in-out ${customStyle}
      ${icon ? "flex items-center justify-center" : ""}  ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      } `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </>
      )}
    </button>
  );
};

export default Button;
