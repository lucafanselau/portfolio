// const DestroyCard: FC<{
//   entry: (typeof collection)[AssetCategory][number];
// }> = ({ entry }) => {
//   const onClick = () => {
//     useStore.getState().startDestroy();
//   };

//   return <ToolsItemCard onClick={onClick} entry={entry} />;
// };

// export const DestroyPanel = () => {
//   return (
//     <div className="grid w-full gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       {keys.map((key) => (
//         <DestroyCard
//           key={key}
//           entry={{ ...collection[key][0], name: keyLabels[key] }}
//         />
//       ))}
//     </div>
//   );
// };

// DEPRECATED: Destroy triggered on button click
export {};
