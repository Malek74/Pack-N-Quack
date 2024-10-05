import CallUsBanner from "./components/CallUsBanner";
import FooterText from "./components/FooterText";
import CopyRights from "./components/CopyRights";

export default function Footer() {
  return(
     <footer className="border-t border-gray-300 text-gray-800 flex-col">
      <CallUsBanner />
      <FooterText />
      <CopyRights />
     </footer>);
}
