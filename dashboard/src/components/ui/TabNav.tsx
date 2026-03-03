interface TabNavProps {
    tabs: { key: string; label: string; count?: number }[]
    activeTab: string
    onChange: (key: string) => void
    className?: string
}

export default function TabNav({ tabs, activeTab, onChange, className = '' }: TabNavProps) {
    return (
        <div className={`flex gap-0 border-b border-light-gray ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 whitespace-nowrap
            ${activeTab === tab.key ? 'tab-active' : 'tab-inactive'}`}
                >
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={`ml-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full
              ${activeTab === tab.key
                                ? 'bg-teal/10 text-teal'
                                : 'bg-light-gray text-charcoal'
                            }`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
