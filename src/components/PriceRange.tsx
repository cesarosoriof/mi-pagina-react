interface PriceRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
}

function formatCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

export default function PriceRange({ min, max, value, onChange }: PriceRangeProps) {
  return (
    <div className="price-range">
      <div className="price-range-labels">
        <span>{formatCOP(value[0])}</span>
        <span className="price-range-sep">—</span>
        <span>{formatCOP(value[1])}</span>
      </div>
      <div className="price-range-track">
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={value[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < value[1]) onChange([v, value[1]]);
          }}
          className="range-input range-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={value[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > value[0]) onChange([value[0], v]);
          }}
          className="range-input range-max"
        />
      </div>
      <div className="price-range-minmax">
        <span>{formatCOP(min)}</span>
        <span>{formatCOP(max)}</span>
      </div>
    </div>
  );
}
