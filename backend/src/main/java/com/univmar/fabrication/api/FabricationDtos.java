package com.univmar.fabrication.api;

import com.univmar.fabrication.domain.*;
import jakarta.validation.constraints.*;
import java.time.*;
import java.util.*;

public final class FabricationDtos {
    private FabricationDtos() { }
    public record CreateInput(@NotNull UUID orderId, @NotBlank @Size(max = 180) String title, FabricationPriority priority, LocalDate dueDate, @Size(max = 4000) String measurementNotes, @Size(max = 1000) String drawingUrl, @Size(max = 4000) String notes, List<OperationInput> operations) { }
    public record OperationInput(@NotNull FabricationOperationType operationType, @Size(max = 2000) String notes) { }
    public record AdvanceInput(@NotNull FabricationStatus status) { }
    public record MaterialInput(@NotNull FabricationMaterialType materialType, @NotNull UUID materialId, @Size(max = 2000) String notes) { }
    public record Operation(UUID id, FabricationOperationType operationType, int sequenceNo, String notes, FabricationOperationStatus status, Instant completedAt) { }
    public record Material(UUID id, FabricationMaterialType materialType, UUID materialId, String label, String detail, String notes) { }
    public record Response(UUID id, String jobNumber, UUID orderId, String orderNumber, String customerName, String projectName, String title, FabricationStatus status, FabricationPriority priority, LocalDate dueDate, String measurementNotes, String drawingUrl, String notes, Instant createdAt, Instant readyAt, List<Operation> operations, List<Material> materials) { }
}
