export const Note = ({ text }: { text: string }) => {
  return (
    <div className="p-6 bg-foreground-100 rounded-[24px] flex w-full relative z-20 flex-col gap-1.5">
      <b>Заметка</b>
      <p>{text}</p>
    </div>
  )
}