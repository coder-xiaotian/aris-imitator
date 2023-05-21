type SettingDrawserProps = {
  isCompact: boolean
  isVariety: boolean
}
export default ({isCompact, isVariety}: SettingDrawserProps) => {
  return (
    <div className="overflow-hidden absolute right-0 h-full rounded-t">
      {
        isCompact ? (
          <div className="w-16 h-full bg-gray-100">窄</div>
        ) : (
          <div>宽</div>
        )
      }
    </div>
  )
}