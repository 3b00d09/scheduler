export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    return(
        <div className="text-text">
            <div className="flex gap-2 justify-center items-center py-4">
                <a href="/create/" className="bg-secondary p-2 w-24 text-center rounded-md">Ai</a>
                <a href="/create/manual" className="bg-secondary p-2 rounded-md w-24 text-center ">Manual</a>
            </div>
            {children}
        </div>
    )
}