export default function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem("univmar-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
