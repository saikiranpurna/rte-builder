interface PropsTableProps {
  props: Array<{
    name: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
  }>;
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="props-table-container">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code className="prop-name">{prop.name}</code>
                {prop.required && (
                  <span className="required-badge">Required</span>
                )}
              </td>
              <td>
                <code className="prop-type">{prop.type}</code>
              </td>
              <td>
                {prop.default ? (
                  <code className="prop-default">{prop.default}</code>
                ) : (
                  <span className="no-default">—</span>
                )}
              </td>
              <td className="prop-description">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
