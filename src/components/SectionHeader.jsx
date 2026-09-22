/**
 * Header bar for a section.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The section title.
 * @returns {JSX.Element} A shaded header bar.
 */
export default function SectionHeader({ title }) {
  return (
    <div className="bg-secondary bg-opacity-10 border-bottom px-3 py-2 fw-semibold text-uppercase text-secondary">
      {title}
    </div>
  );
}