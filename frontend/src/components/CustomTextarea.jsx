const CustomTextarea = ({ defaultValue, placeholder, value, eventHandler }) => {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={eventHandler}
      className="border border-primary w-full rounded-lg min-h-[150px] p-3"
    ></textarea>
  );
};

export default CustomTextarea;
