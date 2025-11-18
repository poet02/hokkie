import styled from "styled-components";

// ----- Styled Components -----
export const Container = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  // height: 100vh;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
  padding: 20px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const SearchAdress = styled.input`
  padding: 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

export const Button = styled.button`
  padding: 12px;
  width: 100%;
  max-width: 300px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

export const Page = styled.div`
  flex: 1;
  justify-content: center;
  justify-items: center;
  color: #333;
`;

export const BottomTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ddd;
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
`;

export const PageContainer = styled.div`
//   padding: 2rem;
  height: 100vh;
  overflow-y: auto;
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

export const PageTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
`;

export const PageSubtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 1.125rem;
`;

export const TilesGrid = styled.div<{
  columns: number;
  gap: string;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.gap};
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Icon = styled.button`
  background: none;
  border: none;
  color: #333;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;