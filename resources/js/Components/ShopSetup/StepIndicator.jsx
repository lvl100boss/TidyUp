import React from "react";

export default function StepIndicator({ currentStep, totalSteps }) {
    return (
        <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
                {[...Array(totalSteps)].map((_, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`w-3 h-3 rounded-full ${
                                index <= currentStep
                                    ? "bg-primary"
                                    : "bg-secondary"
                            }`}
                        />
                        {index < totalSteps - 1 && (
                            <div
                                className={`w-8 h-0.5 ${
                                    index < currentStep
                                        ? "bg-primary"
                                        : "bg-secondary"
                                }`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
