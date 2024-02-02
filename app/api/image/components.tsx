export const Frame = ({
  children,
  padding = 20,
}: {
  children: React.ReactNode;
  padding: number;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", padding }}>
      {children}
    </div>
  );
};

export const WronParams = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <p>Missing tokenContract, tokenId or chainId</p>
    </div>
  );
};
