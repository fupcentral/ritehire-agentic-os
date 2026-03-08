interface TabNavProps {
    tabs: string[]
    active: string
    onChange: (tab: string) => void
}

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
    return (
        <div className="flex items-center gap-0 border-b border-light-gray/60 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`
                        px-5 py-3 text-[13px] font-medium transition-all duration-200 relative cursor-pointer
                        ${active === tab ? 'tab-active' : 'tab-inactive'}
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
