import SectionHeader from './SectionHeader';

/**
 * Bordered card with a section header and padded body.
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - The section header title.
 * @param {React.ReactNode} props.children - Card body content.
 * @param {string} [props.className=''] - Extra classes for the outer container.
 * @param {string} [props.bodyClassName='d-flex flex-column gap-2'] - Extra classes for the body.
 * @returns {JSX.Element} The section card.
 */
export default function SectionCard({
  title,
  children,
  className = '',
  bodyClassName = 'd-flex flex-column gap-2',
}) {
  return (
    <div className={`simple-border p-0 overflow-hidden ${className}`}>
      <SectionHeader title={title} />
      <div className={`px-3 py-2 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}