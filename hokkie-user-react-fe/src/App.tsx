import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Login } from "./Pages/Login";
import { Home } from "./Pages/Home";
import { Profile } from "./Pages/Profile";
import PWABadge from "./PWABadge";
import { Properties } from "./Pages/Properties";
import { Property } from "./Pages/Property";
import { AddProperty } from "./Pages/AddProperty";
import { CircleUserRound, MapPinHouse } from "lucide-react";
import { SearchPlaces } from "./Pages/SearchPlaces";
import { Media } from "./Pages/Media";

// ----- Styled Components -----
const Container = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const BottomTabs = styled.div`
  display: flex;
  justify-content: space-around;
  // padding: 10px 0;
  border-top: 1px solid #ddd;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 10px;
`;

//take in current as prop
const StyledTab = styled(Tab)<{ active?: boolean }>`
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  border-bottom: ${(props) => (props.active ? "2px solid purple" : "none")};
  background-color: ${(props) => (props.active ? "darkviolet" : "transparent")};
  border-radius: 8px;
  color: ${(props) => (props.active ? "white" : "black")};
`;

// ----- Tabs Wrapper -----
function TabsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;
  const showBottomTabs = (current === "/profile" || current === "/search-places");
  return (
    <Container>
      <Routes>
        <Route path="/media" element={<Media />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<Property />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/search-places" element={<SearchPlaces />} />
      </Routes>

      {showBottomTabs && (
        <BottomTabs>
          <StyledTab onClick={() => navigate("/search-places")} active={current === "/search-places"}>
            <MapPinHouse size={24} />
          </StyledTab>
          <StyledTab onClick={() => navigate("/profile")} active={current === "/profile"}>
            <CircleUserRound />
          </StyledTab>
        </BottomTabs>
      )}
    </Container>
  );
}

// ----- App Root -----
export default function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<TabsLayout />} />
      </Routes>
    </Router>
   </>
  );
}
