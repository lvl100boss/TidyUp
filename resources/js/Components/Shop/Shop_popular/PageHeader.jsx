export default function PageHeader({ title }) {
    return (
        <div>
            <h1 className="text-nowrap text-2xl">
                {title}
            </h1>
        </div>
    );
}