package com.RUOtim15.back.gallery;

import com.RUOtim15.back.appUser.AppUser;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Document {

    @Id
    protected Long id;

    private String name; // jedinstveno
    private String type;
    private int size;
    private LocalDateTime creationTime;
    private LocalDateTime lastModified;
    private String description;
    private String tag;
    @ManyToOne //vise dokumenata pripadaju jednoj galeriji
    private Gallery gallery;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name="document_user",
            joinColumns = @JoinColumn(name = "document_id"),
            inverseJoinColumns = @JoinColumn(name = "usser_id"))
    private Collection<AppUser> viewers;
}
