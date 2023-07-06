export const ExploreTools = () => {
  return (
    <ToolsComposition
      bar={
        <>
          <ToolsActionSlideButtons />
          <ToolsProgress item={item} />
        </>
      }
    >
      <ToolsContent />
    </ToolsComposition>
  );
};
