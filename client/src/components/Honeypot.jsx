// Zamka za botove: polje je pomjereno van ekrana (ne display:none, koji botovi prepoznaju i preskoče).
// Ljudi ga ne vide i ne mogu do njega tabom; bot koji popuni sva polja se tako otkrije na serveru.
export default function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
      </label>
    </div>
  )
}
