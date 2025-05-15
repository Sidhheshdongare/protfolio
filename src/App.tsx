import { useEffect } from "react";
// ... other imports

const App = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.ScrollSmoother) {
      window.ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
      });
    }
  }, []);

  return (
    <LoadingProvider>
      <Suspense fallback={<div>Loading app...</div>}>
        <MainContainer>
          <CharacterModel />
        </MainContainer>
      </Suspense>
    </LoadingProvider>
  );
};
